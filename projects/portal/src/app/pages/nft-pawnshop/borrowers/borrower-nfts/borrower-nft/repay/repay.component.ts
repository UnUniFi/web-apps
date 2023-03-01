import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NftPawnshopApplicationService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.application.service';
import { NftPawnshopChartService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.chart.service';
import { RepayRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { Observable, combineLatest, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { rewards } from 'ununifi-client/cjs/rest/nftmarket/module';
import {
  ListedNfts200ResponseListingsInner,
  BidderBids200ResponseBidsInner,
  Loans200ResponseLoansInner,
  Liquidation200ResponseLiquidations,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-repay',
  templateUrl: './repay.component.html',
  styleUrls: ['./repay.component.css'],
})
export class RepayComponent implements OnInit {
  classID$: Observable<string>;
  nftID$: Observable<string>;
  listingInfo$: Observable<ListedNfts200ResponseListingsInner>;
  bidders$: Observable<BidderBids200ResponseBidsInner[]>;
  loans$: Observable<Loans200ResponseLoansInner[]>;
  liquidation$: Observable<Liquidation200ResponseLiquidations>;
  repayAmount$: Observable<number>;
  nftMetadata$: Observable<Metadata>;
  nftImage$: Observable<string>;
  shortestExpiryDate$: Observable<Date>;
  averageInterestRate$: Observable<number>;
  chartData$: Observable<(string | number)[][]>;

  constructor(
    private route: ActivatedRoute,
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
    this.bidders$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.listNftBids$(classID, nftID)),
      map((bidders) => bidders.filter((bidder) => bidder.borrowings?.length)),
      map((bidders) =>
        bidders.sort((a, b) => parseInt(b.deposit_amount?.amount!) - parseInt(a.deposit_amount?.amount!)),
      ),
    );
    this.loans$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) =>
        this.pawnshopQuery
          .listAllLoans$()
          .pipe(
            map((loans) =>
              loans.filter(
                (loan) => loan.nft_id?.class_id == classID && loan.nft_id?.nft_id == nftID,
              ),
            ),
          ),
      ),
    );
    this.liquidation$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getLiquidation$(classID, nftID)),
    );
    this.repayAmount$ = this.liquidation$.pipe(
      map((liq) => Number(liq.liquidation?.amount?.amount) / 1000000),
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

    this.shortestExpiryDate$ = this.bidders$.pipe(
      map((bidders) =>
        bidders.reduce((prev, curr) => {
          const prevDate = new Date(prev.bidding_period!);
          const currDate = new Date(curr.bidding_period!);
          return prevDate > currDate ? curr : prev;
        }),
      ),
      map((bidder) => new Date(bidder.bidding_period!)),
    );

    this.averageInterestRate$ = this.bidders$.pipe(
      map((bidders) => {
        const interests = bidders.reduce(
          (sum, curr) =>
            sum + Number(curr.deposit_amount?.amount) * Number(curr.deposit_lending_rate),
          0,
        );
        const amounts = bidders.reduce((sum, curr) => sum + Number(curr.deposit_amount?.amount), 0);
        return interests / amounts;
      }),
    );

    this.chartData$ = this.bidders$.pipe(
      map((bidders) => this.pawnshopChart.createBorrowingAmountChartData(bidders)),
      map((data) =>
        data.sort(
          (a, b) =>
            Number((a[3] as string).replace('%', '')) - Number((b[3] as string).replace('%', '')),
        ),
      ),
    );
  }

  ngOnInit(): void {}

  onSimulate(data: RepayRequest) {
    const secondaryColor = '#EC0BA1';
    this.chartData$ = this.bidders$.pipe(
      map((bidders) => this.pawnshopChart.createBorrowingAmountChartData(bidders)),
      map((data) =>
        data.sort(
          (a, b) =>
            Number((a[3] as string).replace('%', '')) - Number((b[3] as string).replace('%', '')),
        ),
      ),
      map((chartData) => {
        const amounts = chartData.reduce((sum, curr) => sum + Number(curr[1]), 0);
        const interests = chartData.reduce(
          (sum, curr) => sum + Number(curr[1]) * Number((curr[3] as string).replace('%', '')),
          0,
        );
        let repayAmount = data.amount;
        let sumInterest = 0;
        let i = 0;
        let j = 0;
        while (repayAmount > 0 && i < chartData.length) {
          if (repayAmount > Number(chartData[i][1])) {
            sumInterest +=
              Number(chartData[i][1]) * Number((chartData[i][3] as string).replace('%', ''));
          } else {
            sumInterest += repayAmount * Number((chartData[i][3] as string).replace('%', ''));
            chartData[i][2] = secondaryColor;
            j++;
            break;
          }
          chartData[i][2] = secondaryColor;
          repayAmount -= Number(chartData[i][1]);
          i++;
          j++;
        }
        if (amounts != data.amount) {
          this.averageInterestRate$ = of((interests - sumInterest) / (amounts - data.amount) / 100);
        }
        this.shortestExpiryDate$ = of(
          new Date(
            chartData
              .slice(i)
              .reduce((prev, curr) => (prev < curr[1] ? prev : curr[1]), chartData[0][1]),
          ),
        );
        return chartData;
      }),
    );
  }

  onSubmit(data: RepayRequest) {
    this.pawnshopApp.repay(data.classID, data.nftID, data.symbol, data.amount);
  }
}
