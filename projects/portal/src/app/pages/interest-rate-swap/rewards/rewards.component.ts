import { BandProtocolService } from '../../../models/band-protocols/band-protocol.service';
import { ConfigService, IRSVaultImage } from '../../../models/config.service';
import { getDenomExponent } from '../../../models/cosmos/bank.model';
import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { IrsQueryService } from '../../../models/irs/irs.query.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  AllTranches200ResponseTranchesInner,
  TranchePtAPYs200Response,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css'],
})
export class RewardsComponent implements OnInit {
  address$: Observable<string>;
  vaults$ = this.irsQuery.listVaults$();
  tranchePools$ = this.irsQuery.listAllTranches$();
  Balances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;
  ptBalances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;
  ytBalances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;
  maturedPtPositions$: Observable<
    {
      id: string | undefined;
      name: string | undefined;
      tranche: AllTranches200ResponseTranchesInner | undefined;
      apy: TranchePtAPYs200Response | undefined;
      positionAmount: number;
      positionValue: number;
    }[]
  >;
  maturedPtValue$: Observable<number | undefined>;
  vaultsImages$: Observable<IRSVaultImage[]>;

  constructor(
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly irsQuery: IrsQueryService,
    private readonly bandProtocolService: BandProtocolService,
    private readonly configS: ConfigService,
  ) {
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    this.Balances$ = this.address$.pipe(mergeMap((address) => this.bankQuery.getBalance$(address)));
    this.ptBalances$ = this.Balances$.pipe(
      map((balances) => balances.filter((balance) => balance.denom?.includes('/pt'))),
    );
    this.ytBalances$ = this.Balances$.pipe(
      map((balances) => balances.filter((balance) => balance.denom?.includes('/yt'))),
    );
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.maturedPtPositions$ = combineLatest([
      this.ptBalances$,
      this.tranchePools$,
      this.vaults$,
      denomMetadataMap$,
    ]).pipe(
      mergeMap(([ptBalances, tranches, vaults, metadata]) =>
        Promise.all(
          ptBalances
            .filter((pt) => {
              const tranche = tranches?.find((tranche) => tranche.id === pt.denom?.split('/')[2]);
              return (Number(tranche?.maturity) + Number(tranche?.start_time)) * 1000 < Date.now();
            })
            .map(async (pt) => {
              const id = pt.denom?.split('/')[2];
              const tranche = tranches?.find((tranche) => tranche.id === id);
              const name = vaults?.find(
                (vault) => vault.strategy_contract === tranche?.strategy_contract,
              )?.name;
              const ptApy = id ? await this.irsQuery.getTranchePtAPYs(id) : undefined;
              const redeemAmount =
                id && pt.amount && pt.denom
                  ? await this.irsQuery.estimateSwapInPool(id, pt.denom, pt.amount)
                  : undefined;
              let symbol = metadata[redeemAmount?.denom || '']?.symbol;
              if (symbol?.includes('st')) {
                symbol = symbol.replace('st', '');
              }
              const price = symbol ? await this.bandProtocolService.getPrice(symbol) : 0;
              const positionAmount =
                Number(redeemAmount?.amount) /
                Math.pow(10, getDenomExponent(redeemAmount?.denom || undefined));
              const positionValue = positionAmount * (price || 0);
              return { id, name, tranche, apy: ptApy, positionAmount, positionValue };
            }),
        ),
      ),
    );
    this.maturedPtValue$ = this.maturedPtPositions$.pipe(
      map((positions) => positions.reduce((acc, cur) => acc + cur.positionValue, 0)),
    );
    this.vaultsImages$ = this.configS.config$.pipe(map((config) => config?.irsVaultsImages ?? []));
  }

  ngOnInit(): void {}
}
