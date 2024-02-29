import { ConfigService, IRSVaultImage } from '../../models/config.service';
import { CosmosRestService } from '../../models/cosmos-rest.service';
import { BankQueryService } from '../../models/cosmos/bank.query.service';
import { DistributionApplicationService } from '../../models/cosmos/distribution.application.service';
import { IrsQueryService } from '../../models/irs/irs.query.service';
import { StoredWallet, WalletType } from '../../models/wallets/wallet.model';
import { WalletService } from '../../models/wallets/wallet.service';
import { throughMap } from '../../utils/pipes';
import { BalanceUsecaseService } from './balance.usecase.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { GetNodeInfo200Response } from '@cosmos-client/core/esm/openapi';
import { Observable, combineLatest, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AllTranches200ResponseTranchesInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
})
export class BalanceComponent implements OnInit {
  walletId$: Observable<string | null | undefined>;
  walletType$: Observable<WalletType | null | undefined>;
  accAddress$: Observable<string | null | undefined>;
  accountTypeName$: Observable<string | null | undefined>;
  publicKey$: Observable<string | null | undefined>;
  valAddress$: Observable<string | null | undefined>;
  symbolImageMap: { [symbol: string]: string };
  denomBalancesMap$: Observable<{ [denom: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin }>;
  denomMetadataMap$: Observable<{
    [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata;
  }>;
  irsImages$: Observable<(AllTranches200ResponseTranchesInner & IRSVaultImage)[] | undefined>;

  faucetSymbols$: Observable<string[] | undefined>;
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
  nodeInfo$: Observable<GetNodeInfo200Response>;
  account$: Observable<
    | cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount
    | cosmosclient.proto.cosmos.vesting.v1beta1.ContinuousVestingAccount
    | unknown
    | undefined
  >;

  constructor(
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly rest: CosmosRestService,
    private usecase: BalanceUsecaseService,
    private readonly distributionAppService: DistributionApplicationService,
    private readonly configS: ConfigService,
    private readonly irsQuery: IrsQueryService,
  ) {
    const wallet$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
    );
    const address$ = wallet$.pipe(map((wallet) => wallet.address));
    this.walletId$ = wallet$.pipe(map((wallet) => wallet.id));
    this.walletType$ = wallet$.pipe(map((wallet) => wallet.type));
    this.accAddress$ = wallet$.pipe(map((wallet) => wallet.address));
    this.publicKey$ = wallet$.pipe(map((wallet) => wallet.public_key));
    const cosmosWallet$ = wallet$.pipe(
      throughMap((storedWallet) =>
        this.walletService.convertStoredWalletToCosmosWallet(storedWallet),
      ),
    );
    this.valAddress$ = cosmosWallet$.pipe(
      throughMap((wallet) => wallet.address.toValAddress().toString()),
    );
    this.symbolImageMap = this.bankQuery.getSymbolImageMap();
    this.denomBalancesMap$ = address$.pipe(
      mergeMap((address) => this.bankQuery.getDenomBalanceMap$(address!)),
    );
    this.denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();

    this.faucets$ = this.usecase.faucets$;
    this.faucetSymbols$ = combineLatest([this.faucets$, this.denomMetadataMap$]).pipe(
      map(([faucets, denomMetadataMap]) =>
        faucets?.map((f) => denomMetadataMap?.[f.denom!].symbol || 'Invalid Token'),
      ),
    );
    this.nodeInfo$ = this.rest.getNodeInfo$();
    this.accountTypeName$ = this.usecase.accountTypeName$;
    this.account$ = address$.pipe(
      mergeMap((address) => {
        if (address === undefined) {
          return of(undefined);
        }
        return this.rest.getAccount$(address.toString());
      }),
      map((account) => {
        const { protoJSONToInstance, castProtoJSONOfProtoAny } = cosmosclient.codec;
        return account && protoJSONToInstance(castProtoJSONOfProtoAny(account));
      }),
    );

    const irsTranche$ = this.irsQuery.listAllTranches$();
    const irsImages$ = this.configS.config$.pipe(map((config) => config?.irsVaultsImages ?? []));
    this.irsImages$ = combineLatest([irsTranche$, irsImages$]).pipe(
      map(([tranches, images]) =>
        tranches?.map((tranche) => {
          const image = images.find((i) => i.contract === tranche.strategy_contract) || {
            contract: tranche.strategy_contract || '',
            image: '',
            subImage: '',
          };
          return {
            ...tranche,
            ...image,
          };
        }),
      ),
    );
  }

  ngOnInit(): void {}

  onSubmitWithdrawAllDelegatorReward() {
    this.distributionAppService.openWithdrawAllDelegatorRewardFormDialog();
  }
}
