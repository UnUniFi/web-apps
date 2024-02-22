import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { BankService } from 'projects/portal/src/app/models/cosmos/bank.service';
import { NftPawnshopApplicationService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.application.service';
import { NftPawnshopChartService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.chart.service';
import { RepayRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { Metadata } from 'projects/portal/src/app/models/nft/nft.model';
import { Observable, combineLatest, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  NftBids200ResponseBidsInner,
  Liquidation200ResponseLiquidations,
  ListedNfts200ResponseListingsInnerListing,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-repay',
  templateUrl: './repay.component.html',
  styleUrls: ['./repay.component.css'],
})
export class RepayComponent implements OnInit {
  classID$: Observable<string>;
  nftID$: Observable<string>;
  listingInfo$: Observable<ListedNfts200ResponseListingsInnerListing>;
  symbol$: Observable<string | null | undefined>;
  symbolMetadataMap$: Observable<{
    [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata;
  }>;
  symbolImage$: Observable<string | undefined>;
  bids$: Observable<NftBids200ResponseBidsInner[]>;
  liquidation$: Observable<Liquidation200ResponseLiquidations>;
  repayAmount$: Observable<number>;
  nftMetadata$: Observable<Metadata>;
  nftImage$: Observable<string>;
  chartData$: Observable<(string | number)[][]>;

  constructor(
    private route: ActivatedRoute,
    private readonly bankService: BankService,
    private readonly bankQuery: BankQueryService,
    private readonly pawnshop: NftPawnshopService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
    private readonly pawnshopChart: NftPawnshopChartService,
    private readonly pawnshopApp: NftPawnshopApplicationService,
  ) {
    this.classID$ = this.route.params.pipe(map((params) => params.class_id));
    this.nftID$ = this.route.params.pipe(map((params) => params.nft_id));
    const nftCombine$ = combineLatest([this.classID$, this.nftID$]);
    this.listingInfo$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getListedNft$(classID, nftID)),
    );
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();
    this.symbol$ = combineLatest([this.listingInfo$, denomMetadataMap$]).pipe(
      map(([info, metadata]) => metadata[info.bid_denom || ''].symbol),
    );
    this.symbolImage$ = this.symbol$.pipe(
      map((symbol) => this.bankQuery.symbolImages().find((i) => i.symbol === symbol)?.image),
    );
    this.bids$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.listNftBids$(classID, nftID)),
      map((bidders) => bidders.filter((bidder) => bidder.loan?.amount?.amount !== '0')),
      map((bidders) =>
        bidders.sort((a, b) => parseInt(b.deposit?.amount!) - parseInt(a.deposit?.amount!)),
      ),
    );
    this.liquidation$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getLiquidation$(classID, nftID)),
    );

    this.repayAmount$ = combineLatest([this.liquidation$, denomMetadataMap$]).pipe(
      map(
        ([liquidation, denomMetadataMap]) =>
          this.bankService.convertCoinToSymbolAmount(
            liquidation.liquidation?.amount || { amount: '0', denom: '' },
            denomMetadataMap,
          ).amount,
      ),
    );

    const nftData$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getNft$(classID, nftID)),
    );
    this.nftMetadata$ = nftData$.pipe(
      mergeMap((nft) => this.pawnshop.getMetadataFromUri(nft.nft?.uri || '')),
    );
    this.nftImage$ = nftData$.pipe(
      mergeMap((nft) => this.pawnshop.getImageFromUri(nft.nft?.uri || '')),
    );

    this.chartData$ = this.bids$.pipe(
      map((bids) => this.pawnshopChart.createBorrowingAmountChartData(bids)),
      map((data) =>
        data.sort(
          (a, b) =>
            Number((a[3] as string).replace('%', '')) - Number((b[3] as string).replace('%', '')),
        ),
      ),
    );
  }

  ngOnInit(): void {}

  onSubmit(data: RepayRequest) {
    this.pawnshopApp.repay(data.classID, data.nftID, data.repayBids);
  }
}
