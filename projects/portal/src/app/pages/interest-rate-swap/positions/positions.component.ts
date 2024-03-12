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
  TranchePoolAPYs200Response,
  TranchePtAPYs200Response,
  TrancheYtAPYs200Response,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css'],
})
export class PositionsComponent implements OnInit {
  address$: Observable<string>;
  vaults$ = this.irsQuery.listVaults$();
  tranchePools$ = this.irsQuery.listAllTranches$();
  Balances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;
  ptBalances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;
  ytBalances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;
  lpBalances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;
  ptPositions$: Observable<
    {
      id: string | undefined;
      name: string | undefined;
      tranche: AllTranches200ResponseTranchesInner | undefined;
      apy: TranchePtAPYs200Response | undefined;
      positionAmount: number;
      positionValue: number;
    }[]
  >;
  ytPositions$: Observable<
    {
      id: string | undefined;
      name: string | undefined;
      tranche: AllTranches200ResponseTranchesInner | undefined;
      apy: TrancheYtAPYs200Response | undefined;
      positionAmount: number;
      positionValue: number;
    }[]
  >;
  lpPositions$: Observable<
    {
      id: string | undefined;
      name: string | undefined;
      tranche: AllTranches200ResponseTranchesInner | undefined;
      apy: TranchePoolAPYs200Response | undefined;
      ytApy: TrancheYtAPYs200Response | undefined;
      positionAmount: number;
      positionValue: number;
    }[]
  >;
  ptPositionValue$: Observable<number | undefined>;
  maturedPtValue$: Observable<number | undefined>;
  vaultsImages$: Observable<IRSVaultImage[]>;

  constructor(
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly irsQuery: IrsQueryService,
    private readonly configS: ConfigService,
    private readonly bandProtocolService: BandProtocolService,
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
    this.lpBalances$ = this.Balances$.pipe(
      map((balances) => balances.filter((balance) => balance.denom?.includes('/ls'))),
    );
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.ptPositions$ = combineLatest([
      this.ptBalances$,
      this.tranchePools$,
      this.vaults$,
      denomMetadataMap$,
    ]).pipe(
      mergeMap(([ptBalances, tranches, vaults, metadata]) =>
        Promise.all(
          ptBalances.map(async (pt) => {
            const id = pt.denom?.split('/')[2];
            const tranche = tranches?.find((tranche) => tranche.id === id);
            const name = vaults?.find(
              (vault) => vault.strategy_contract === tranche?.strategy_contract,
            )?.name;
            const apy = id ? await this.irsQuery.getTranchePtAPYs(id) : undefined;
            let symbol = metadata[tranche?.deposit_denom || '']?.symbol;
            if (symbol?.includes('st')) {
              symbol = symbol.replace('st', '');
            }
            const price = symbol ? await this.bandProtocolService.getPrice(symbol) : 0;
            const positionAmount =
              Number(pt.amount) /
              Number(apy?.pt_rate_per_deposit) /
              Math.pow(10, getDenomExponent(tranche?.deposit_denom));
            const positionValue = positionAmount * (price || 0);
            return { id, name, tranche, apy, positionAmount, positionValue };
          }),
        ),
      ),
    );
    this.ytPositions$ = combineLatest([
      this.ytBalances$,
      this.tranchePools$,
      this.vaults$,
      denomMetadataMap$,
    ]).pipe(
      mergeMap(([ytBalances, tranches, vaults, metadata]) =>
        Promise.all(
          ytBalances.map(async (yt) => {
            const id = yt.denom?.split('/')[2];
            const tranche = tranches?.find((tranche) => tranche.id === id);
            const name = vaults?.find(
              (vault) => vault.strategy_contract === tranche?.strategy_contract,
            )?.name;
            const apy = id ? await this.irsQuery.getTrancheYtAPYs(id) : undefined;
            let symbol = metadata[tranche?.deposit_denom || '']?.symbol;
            if (symbol?.includes('st')) {
              symbol = symbol.replace('st', '');
            }
            const price = symbol ? await this.bandProtocolService.getPrice(symbol) : 0;
            const positionAmount = apy?.yt_rate_per_deposit
              ? Number(yt.amount) /
                Number(apy.yt_rate_per_deposit) /
                Math.pow(10, getDenomExponent(tranche?.deposit_denom))
              : 0;
            const positionValue = positionAmount * (price || 0);
            return { id, name, tranche, apy, positionAmount, positionValue };
          }),
        ),
      ),
    );
    this.ytPositions$.subscribe((balances) => console.log(balances));
    this.lpPositions$ = combineLatest([
      this.lpBalances$,
      this.tranchePools$,
      this.vaults$,
      denomMetadataMap$,
    ]).pipe(
      mergeMap(([lpBalances, tranches, vaults, metadata]) =>
        Promise.all(
          lpBalances.map(async (lp) => {
            const id = lp.denom?.split('/')[2];
            const tranche = tranches?.find((tranche) => tranche.id === id);
            const name = vaults?.find(
              (vault) => vault.strategy_contract === tranche?.strategy_contract,
            )?.name;
            const apy = id ? await this.irsQuery.getTranchePoolAPYs(id) : undefined;
            const ytApy = id ? await this.irsQuery.getTrancheYtAPYs(id) : undefined;
            let symbol = metadata[tranche?.deposit_denom || '']?.symbol;
            if (symbol?.includes('st')) {
              symbol = symbol.replace('st', '');
            }
            const price = symbol ? await this.bandProtocolService.getPrice(symbol) : 0;
            const positionAmount =
              Number(lp.amount) /
              Number(apy?.liquidity_rate_per_deposit) /
              Math.pow(10, getDenomExponent(tranche?.deposit_denom));
            const positionValue = positionAmount * (price || 0);
            return { id, name, tranche, apy, ytApy, positionAmount, positionValue };
          }),
        ),
      ),
    );
    this.ptPositionValue$ = this.ptPositions$.pipe(
      map((ptPositions) => ptPositions.reduce((acc, cur) => acc + cur.positionValue, 0)),
    );
    this.maturedPtValue$ = this.ptPositions$.pipe(
      map((ptPositions) => {
        const matured = ptPositions.filter((pt) =>
          pt.tranche
            ? (Number(pt.tranche.maturity) + Number(pt.tranche.start_time)) * 1000 < Date.now()
            : false,
        );
        return matured.reduce((acc, cur) => acc + cur.positionValue, 0);
      }),
    );
    this.vaultsImages$ = this.configS.config$.pipe(map((config) => config?.irsVaultsImages ?? []));
  }

  ngOnInit(): void {}
}
