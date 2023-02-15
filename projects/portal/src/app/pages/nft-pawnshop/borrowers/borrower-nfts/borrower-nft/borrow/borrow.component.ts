import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NftPawnshopApplicationService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.application.service';
import { NftPawnshopChartService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.chart.service';
import { BorrowRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { Observable, combineLatest, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  ListedNfts200ResponseListingsInner,
  BidderBids200ResponseBidsInner,
  Loans200ResponseLoansInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.css'],
})
export class BorrowComponent implements OnInit {
  classID$: Observable<string>;
  nftID$: Observable<string>;
  listingInfo$: Observable<ListedNfts200ResponseListingsInner>;
  bidders$: Observable<BidderBids200ResponseBidsInner[]>;
  loans$: Observable<Loans200ResponseLoansInner[]>;
  nftMetadata$: Observable<Metadata>;
  nftImage$: Observable<string>;
  shortestExpiryDate$: Observable<Date>;
  averageInterestRate$: Observable<number>;
  chartData$: Observable<(string | number)[][]>;
  borrowAmount$: Observable<number>;

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
    );
    this.borrowAmount$ = this.bidders$.pipe(
      map((bidders) =>
        bidders.reduce((sum, bidder) => {
          const deposit = sum + Number(bidder.deposit_amount?.amount);
          if (bidder.borrowings && bidder.borrowings.length) {
            const borrow = bidder.borrowings.reduce(
              (sum, borrowing) => sum + Number(borrowing.amount?.amount),
              0,
            );
            return deposit - borrow;
          } else {
            return deposit;
          }
        }, 0),
      ),
      map((amount) => amount / 1000000),
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
      map((bidders) => this.pawnshopChart.createDepositAmountChartData(bidders)),
      map((data) =>
        data.sort(
          (a, b) =>
            Number((a[3] as string).replace('%', '')) - Number((b[3] as string).replace('%', '')),
        ),
      ),
    );
  }

  ngOnInit(): void {}

  onSimulate(data: BorrowRequest) {
    const primaryColor = '#3A4D8F';
    const secondaryColor = '#EC0BA1';
    this.chartData$ = this.bidders$.pipe(
      map((bidders) => this.pawnshopChart.createDepositAmountChartData(bidders)),
      map((data) =>
        data.sort(
          (a, b) =>
            Number((a[3] as string).replace('%', '')) - Number((b[3] as string).replace('%', '')),
        ),
      ),
      map((chartData) => {
        let borrowAmount = data.amount;
        let shortestExpiry = new Date(chartData[chartData.length - 1][0]);
        let sumInterest = 0;
        let i = 1;
        while (borrowAmount > 0 && chartData.length >= i) {
          if (chartData[chartData.length - i][2] == primaryColor) {
            if (borrowAmount - Number(chartData[chartData.length - i][1]) > 0) {
              sumInterest +=
                Number(chartData[chartData.length - i][1]) *
                Number((chartData[chartData.length - i][3] as string).replace('%', ''));
            } else {
              sumInterest +=
                borrowAmount *
                Number((chartData[chartData.length - i][3] as string).replace('%', ''));
            }
            const currentDate = new Date(chartData[chartData.length - i][0]);
            if (shortestExpiry > currentDate) {
              shortestExpiry = currentDate;
            }
            chartData[chartData.length - i][2] = secondaryColor;
            borrowAmount -= Number(chartData[chartData.length - i][1]);
          }
          i++;
        }
        this.shortestExpiryDate$ = of(shortestExpiry);
        console.log(sumInterest, data.amount);
        this.averageInterestRate$ = of(sumInterest / data.amount / 100);
        return chartData;
      }),
    );
  }

  onSubmit(data: BorrowRequest) {
    this.pawnshopApp.borrow(data.classID, data.nftID, data.symbol, data.amount);
  }
}
