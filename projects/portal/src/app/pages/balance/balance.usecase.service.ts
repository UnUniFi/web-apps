import { Config, ConfigService } from '../../models/config.service';
import { CosmosRestService } from '../../models/cosmos-rest.service';
import { CosmosWallet, StoredWallet, WalletType } from '../../models/wallets/wallet.model';
import { WalletService } from '../../models/wallets/wallet.service';
import { throughMap } from '../../utils/pipes';
import {
  convertTypedAccountToTypedName,
  convertUnknownAccountToTypedAccount,
} from './../../utils/converter';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { InlineResponse20012 } from '@cosmos-client/core/esm/openapi';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BalanceUsecaseService {
  private config$: Observable<Config | undefined>;
  private currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  private currentCosmosWallet$: Observable<CosmosWallet | null | undefined>;
  private cosmosAccAddress$: Observable<cosmosclient.AccAddress | null | undefined>;

  constructor(
    private configService: ConfigService,
    private walletService: WalletService,
    private rest: CosmosRestService,
  ) {
    this.config$ = this.configService.config$;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.currentCosmosWallet$ = this.currentStoredWallet$.pipe(
      throughMap((storedWallet) =>
        this.walletService.convertStoredWalletToCosmosWallet(storedWallet),
      ),
    );
    this.cosmosAccAddress$ = this.currentCosmosWallet$.pipe(
      throughMap((cosmosWallet) => cosmosWallet.address),
    );
  }
  get nodeInfo$(): Observable<InlineResponse20012> {
    return this.rest.getNodeInfo$();
  }

  get walletId$(): Observable<string | null | undefined> {
    return this.currentStoredWallet$.pipe(throughMap((wallet) => wallet.id));
  }
  get walletType$(): Observable<WalletType | null | undefined> {
    return this.currentStoredWallet$.pipe(throughMap((wallet) => wallet.type));
  }
  get publicKey$(): Observable<string | null | undefined> {
    return this.currentStoredWallet$.pipe(throughMap((wallet) => wallet.public_key));
  }

  get accAddress$(): Observable<string | null | undefined> {
    return this.currentCosmosWallet$.pipe(throughMap((wallet) => wallet.address.toString()));
  }
  get valAddress$(): Observable<string | null | undefined> {
    return this.currentCosmosWallet$.pipe(
      throughMap((wallet) => wallet.address.toValAddress().toString()),
    );
  }

  get accountTypeName$(): Observable<string | null | undefined> {
    return this.cosmosAccAddress$.pipe(
      mergeMap((cosmosAccAddress) => {
        if (!cosmosAccAddress) {
          return of(cosmosAccAddress);
        }
        return this.rest.getAccount$(cosmosAccAddress);
      }),
      map((account) => {
        const { protoJSONToInstance, castProtoJSONOfProtoAny } = cosmosclient.codec;
        return account && protoJSONToInstance(castProtoJSONOfProtoAny(account));
      }),
      map((cosmosUnknownAccount) => convertUnknownAccountToTypedAccount(cosmosUnknownAccount)),
      map((cosmosAccount) => convertTypedAccountToTypedName(cosmosAccount)),
    );
  }
  get balances$(): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null | undefined> {
    return this.cosmosAccAddress$.pipe(
      mergeMap((cosmosAccAddress) => {
        if (!cosmosAccAddress) {
          return of(cosmosAccAddress);
        }
        return this.rest.getAllBalances$(cosmosAccAddress);
      }),
    );
  }
  get faucets$(): Observable<
    | {
        hasFaucet: boolean;
        faucetURL: string;
        denom: string;
        creditAmount: number;
        maxCredit: number;
      }[]
    | undefined
  > {
    return combineLatest([this.config$, this.balances$]).pipe(
      map(([config, balances]) => {
        if (!config?.extension?.faucet?.length) {
          return [];
        }
        if (balances === null) {
          // loading...
          return [];
        }
        const allFaucets = config.extension.faucet.filter((faucet) => faucet.hasFaucet);
        if (balances === undefined || balances.length === 0) {
          return allFaucets;
        }
        return allFaucets.filter((faucet) => {
          const balance = balances.find((balance) => balance.denom === faucet.denom);
          if (!balance || !balance.amount) {
            // Faucet that has never been withdrawn.
            return true;
          }
          if (parseInt(balance.amount) <= faucet.maxCredit) {
            // Not withdrawn up to the maximum amount that can be withdrawn
            return true;
          }
          // Excluding Faucet, which has withdrawn up to the maximum limit
          return false;
        });
      }),
    );
  }
}
