import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { InlineResponse20012 } from '@cosmos-client/core/esm/openapi';
import { PubKey } from '@cosmos-client/core/esm/types';
import { Config, ConfigService } from 'projects/shared/src/lib/models/config/config.service';
import { CosmosSDKService } from 'projects/shared/src/lib/models/cosmos-sdk/cosmos-sdk.service';
import {
  CosmosWallet,
  StoredWallet,
  WalletType,
} from 'projects/shared/src/lib/models/wallets/wallet.model';
import { WalletService } from 'projects/shared/src/lib/models/wallets/wallet.service';
import {
  convertTypedAccountToTypedName,
  convertUnknownAccountToBaseAccount,
  convertUnknownAccountToTypedAccount,
} from 'projects/shared/src/lib/utils/converter';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
})
export class BalanceComponent implements OnInit {
  config$: Observable<Config | undefined>;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  currentCosmosWallet$: Observable<CosmosWallet | null | undefined>;
  walletId$: Observable<string | null | undefined>;
  walletType$: Observable<WalletType | null | undefined>;
  cosmosPublicKey$: Observable<PubKey | null | undefined>;
  publicKey$: Observable<string | null | undefined>;
  cosmosAccAddress$: Observable<cosmosclient.AccAddress | null | undefined>;
  accAddress$: Observable<string | null | undefined>;
  cosmosValAddress$: Observable<cosmosclient.ValAddress | null | undefined>;
  valAddress$: Observable<string | null | undefined>;
  cosmosUnknownAccount$: Observable<unknown | null | undefined>;
  cosmosAccount$: Observable<
    | cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount
    | cosmosclient.proto.cosmos.vesting.v1beta1.BaseVestingAccount
    | cosmosclient.proto.cosmos.vesting.v1beta1.ContinuousVestingAccount
    | cosmosclient.proto.cosmos.vesting.v1beta1.DelayedVestingAccount
    | cosmosclient.proto.cosmos.vesting.v1beta1.PeriodicVestingAccount
    | cosmosclient.proto.cosmos.vesting.v1beta1.PermanentLockedAccount
    | cosmosclient.proto.cosmos.auth.v1beta1.ModuleAccount
    | null
    | undefined
  >;
  cosmosBaseAccount$: Observable<
    cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount | null | undefined
  >;
  accountTypeName$: Observable<string | null | undefined>;
  balances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null | undefined>;
  faucets$: Observable<
    | {
        hasFaucet: boolean;
        faucetURL: string;
        denom: string;
        creditAmount: number;
        maxCredit: number;
      }[]
    | undefined
  >;
  nodeInfo$: Observable<InlineResponse20012>;

  constructor(
    private configService: ConfigService,
    private cosmosSDK: CosmosSDKService,
    private walletService: WalletService,
  ) {
    this.config$ = this.configService.config$;
    const sdk$ = this.cosmosSDK.sdk$;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.currentCosmosWallet$ = this.currentStoredWallet$.pipe(
      map((storedWallet) =>
        storedWallet
          ? this.walletService.convertStoredWalletToCosmosWallet(storedWallet)
          : storedWallet,
      ),
    );
    this.walletId$ = this.currentStoredWallet$.pipe(
      map((storedWallet) => (storedWallet ? storedWallet.id : storedWallet)),
    );
    this.walletType$ = this.currentStoredWallet$.pipe(
      map((storedWallet) => (storedWallet ? storedWallet.type : storedWallet)),
    );
    this.cosmosPublicKey$ = this.currentCosmosWallet$.pipe(
      map((cosmosWallet) => (cosmosWallet ? cosmosWallet.public_key : cosmosWallet)),
    );
    this.publicKey$ = this.currentStoredWallet$.pipe(
      map((storedWallet) => (storedWallet ? storedWallet.public_key : storedWallet)),
    );
    this.cosmosAccAddress$ = this.currentCosmosWallet$.pipe(
      map((cosmosWallet) => (cosmosWallet ? cosmosWallet.address : cosmosWallet)),
    );
    this.accAddress$ = this.cosmosAccAddress$.pipe(
      map((accAddress) => (accAddress ? accAddress.toString() : accAddress)),
    );
    this.cosmosValAddress$ = this.currentCosmosWallet$.pipe(
      map((cosmosWallet) => (cosmosWallet ? cosmosWallet.address.toValAddress() : cosmosWallet)),
    );
    this.valAddress$ = this.cosmosValAddress$.pipe(
      map((valAddress) => (valAddress ? valAddress.toString() : valAddress)),
    );
    this.cosmosUnknownAccount$ = combineLatest([sdk$, this.cosmosAccAddress$]).pipe(
      mergeMap(([sdk, cosmosAccAddress]) => {
        if (!cosmosAccAddress) {
          return of(cosmosAccAddress);
        }
        return cosmosclient.rest.auth
          .account(sdk.rest, cosmosAccAddress)
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
    this.cosmosAccount$ = this.cosmosUnknownAccount$.pipe(
      map((cosmosUnknownAccount) => convertUnknownAccountToTypedAccount(cosmosUnknownAccount)),
    );
    this.cosmosBaseAccount$ = this.cosmosUnknownAccount$.pipe(
      map((cosmosUnknownAccount) => convertUnknownAccountToBaseAccount(cosmosUnknownAccount)),
    );
    this.accountTypeName$ = this.cosmosAccount$.pipe(
      map((cosmosAccount) => convertTypedAccountToTypedName(cosmosAccount)),
    );
    this.balances$ = combineLatest([sdk$, this.cosmosAccAddress$]).pipe(
      mergeMap(([sdk, cosmosAccAddress]) => {
        if (!cosmosAccAddress) {
          return of(cosmosAccAddress);
        }
        return cosmosclient.rest.bank
          .allBalances(sdk.rest, cosmosAccAddress)
          .then((res) => res.data.balances)
          .catch((error) => {
            console.error(error);
            return undefined;
          });
      }),
    );
    this.faucets$ = combineLatest([this.config$, this.balances$]).pipe(
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
    this.nodeInfo$ = sdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.tendermint.getNodeInfo(sdk.rest).then((res) => res.data)),
    );
  }

  ngOnInit(): void {}
}
