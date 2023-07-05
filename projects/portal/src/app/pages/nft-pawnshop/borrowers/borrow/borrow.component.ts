import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { denomExponentMap } from 'projects/portal/src/app/models/cosmos/bank.model';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { NftPawnshopApplicationService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.application.service';
import { NftPawnshopChartService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.chart.service';
import { BorrowRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { Observable, combineLatest, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  ListedNfts200ResponseListingsInnerListing,
  BidderBids200ResponseBidsInner,
  Loan200Response,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.css'],
})
export class BorrowComponent implements OnInit {
  classID$: Observable<string>;
  nftID$: Observable<string>;
  listingInfo$: Observable<ListedNfts200ResponseListingsInnerListing>;
  symbol$: Observable<string | null | undefined>;
  symbolMetadataMap$: Observable<{
    [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata;
  }>;
  symbolImage$: Observable<string | undefined>;
  bids$: Observable<BidderBids200ResponseBidsInner[]>;
  loan$: Observable<Loan200Response>;
  nftMetadata$: Observable<Metadata>;
  nftImage$: Observable<string>;
  chartData$: Observable<(string | number)[][]>;
  borrowAmount$: Observable<number>;

  constructor(
    private route: ActivatedRoute,
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
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getNftListing$(classID, nftID)),
    );
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();
    this.symbol$ = combineLatest([this.listingInfo$, denomMetadataMap$]).pipe(
      map(([info, metadata]) => metadata[info.bid_token || ''].symbol),
    );
    this.symbolImage$ = this.symbol$.pipe(
      map((symbol) => this.bankQuery.symbolImages().find((i) => i.symbol === symbol)?.image),
    );
    this.bids$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.listNftBids$(classID, nftID)),
      map((bidders) =>
        bidders.sort(
          (a, b) => parseInt(b.deposit_amount?.amount!) - parseInt(a.deposit_amount?.amount!),
        ),
      ),
    );
    this.loan$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getLoan$(classID, nftID)),
    );
    this.borrowAmount$ = this.loan$.pipe(
      map((loan) => {
        const maxBorrow = Number(loan.borrowing_limit?.amount);
        const exponent = denomExponentMap[loan.borrowing_limit?.denom || ''];
        return maxBorrow / 10 ** exponent;
      }),
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
      map((bids) => this.pawnshopChart.createDepositAmountChartData(bids)),
      map((data) =>
        data.sort(
          (a, b) =>
            Number((a[3] as string).replace('%', '')) - Number((b[3] as string).replace('%', '')),
        ),
      ),
    );
  }

  ngOnInit(): void {}

  onSubmit(data: BorrowRequest) {
    this.pawnshopApp.borrow(data.classID, data.nftID, data.borrowBids);
  }
}
