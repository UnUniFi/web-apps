import { CosmosSDKService } from '../../models';
import { Config, ConfigService } from '../../models/config.service';
import { CosmosWallet, StoredWallet, WalletType } from '../../models/wallets/wallet.model';
import { WalletService } from '../../models/wallets/wallet.service';
import {
  convertTypedAccountToTypedName,
  convertUnknownAccountToTypedAccount,
} from './../../utils/converter';
import { Injectable } from '@angular/core';
import { cosmosclient, proto, rest } from '@cosmos-client/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { InlineResponse20012 } from '@cosmos-client/core/esm/openapi';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BalanceUsecaseService {
  private config$: Observable<Config | undefined>;
  private currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  private currentCosmosWallet$: Observable<CosmosWallet | null | undefined>;
  private sdk$: Observable<{ rest: CosmosSDK; websocket: CosmosSDK }>;
  private cosmosAccAddress$: Observable<cosmosclient.AccAddress | null | undefined>;

  constructor(
    private configService: ConfigService,
    private cosmosSDK: CosmosSDKService,
    private walletService: WalletService,
  ) {
    this.config$ = this.configService.config$;
    this.sdk$ = this.cosmosSDK.sdk$;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.currentCosmosWallet$ = this.currentStoredWallet$.pipe(
      map((storedWallet) =>
        storedWallet
          ? this.walletService.convertStoredWalletToCosmosWallet(storedWallet)
          : storedWallet,
      ),
    );
    this.cosmosAccAddress$ = this.currentCosmosWallet$.pipe(
      map((cosmosWallet) => (cosmosWallet ? cosmosWallet.address : cosmosWallet)),
    );
  }

  get walletId$(): Observable<string | null | undefined> {
    return this.currentStoredWallet$.pipe(
      map((storedWallet) => (storedWallet ? storedWallet.id : storedWallet)),
    );
  }
  get walletType$(): Observable<WalletType | null | undefined> {
    return this.currentStoredWallet$.pipe(
      map((storedWallet) => (storedWallet ? storedWallet.type : storedWallet)),
    );
  }
  get accAddress$(): Observable<string | null | undefined> {
    const cosmosAccAddress$ = this.currentCosmosWallet$.pipe(
      map((cosmosWallet) => (cosmosWallet ? cosmosWallet.address : cosmosWallet)),
    );
    return cosmosAccAddress$.pipe(
      map((accAddress) => (accAddress ? accAddress.toString() : accAddress)),
    );
  }
  get accountTypeName$(): Observable<string | null | undefined> {
    const cosmosUnknownAccount$ = combineLatest([this.sdk$, this.cosmosAccAddress$]).pipe(
      mergeMap(([sdk, cosmosAccAddress]) => {
        if (!cosmosAccAddress) {
          return of(cosmosAccAddress);
        }
        return rest.auth
          .account(sdk.rest, cosmosAccAddress)
          .then((res) => {
            console.log(res.data.account);
            return res;
          })
          .then(
            (res) =>
              res.data &&
              cosmosclient.codec.protoJSONToInstance(
                cosmosclient.codec.castProtoJSONOfProtoAny(res.data.account),
              ),
          )
          .catch((error) => {
            console.error(error);
            return undefined;
          });
      }),
    );
    const cosmosAccount$ = cosmosUnknownAccount$.pipe(
      map((cosmosUnknownAccount) => convertUnknownAccountToTypedAccount(cosmosUnknownAccount)),
    );
    return cosmosAccount$.pipe(
      map((cosmosAccount) => convertTypedAccountToTypedName(cosmosAccount)),
    );
  }
  get publicKey$(): Observable<string | null | undefined> {
    return this.currentStoredWallet$.pipe(
      map((storedWallet) => (storedWallet ? storedWallet.public_key : storedWallet)),
    );
  }
  get valAddress$(): Observable<string | null | undefined> {
    const cosmosValAddress$ = this.currentCosmosWallet$.pipe(
      map((cosmosWallet) => (cosmosWallet ? cosmosWallet.address.toValAddress() : cosmosWallet)),
    );
    return cosmosValAddress$.pipe(
      map((valAddress) => (valAddress ? valAddress.toString() : valAddress)),
    );
  }
  get balances$(): Observable<proto.cosmos.base.v1beta1.ICoin[] | null | undefined> {
    return combineLatest([this.sdk$, this.cosmosAccAddress$]).pipe(
      mergeMap(([sdk, cosmosAccAddress]) => {
        if (!cosmosAccAddress) {
          return of(cosmosAccAddress);
        }
        return rest.bank
          .allBalances(sdk.rest, cosmosAccAddress)
          .then((res) => res.data.balances)
          .catch((error) => {
            console.error(error);
            return undefined;
          });
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
        const allFaucets = config.extension.faucet.filter((faucet) => faucet.hasFaucet);
        if (balances === null) {
          return [];
        }
        if (balances === undefined) {
          return allFaucets;
        }
        if (balances.length === 0) {
          return allFaucets;
        }
        return allFaucets?.filter((faucet) => {
          const isNotFoundFaucetDenomBalance =
            balances.find((balance) => balance.denom === faucet.denom) === undefined;
          const faucetDenomBalanceAmount = balances.find(
            (balance) => balance.denom === faucet.denom,
          )?.amount;
          const isLessThanMaxCreditFaucetDenomBalance = faucetDenomBalanceAmount
            ? parseInt(faucetDenomBalanceAmount) <= faucet.maxCredit
            : false;
          if (isNotFoundFaucetDenomBalance || isLessThanMaxCreditFaucetDenomBalance) {
            return true;
          } else {
            return false;
          }
        });
      }),
    );
  }
  get nodeInfo$(): Observable<InlineResponse20012> {
    return this.sdk$.pipe(
      mergeMap((sdk) => rest.tendermint.getNodeInfo(sdk.rest).then((res) => res.data)),
    );
  }
}
