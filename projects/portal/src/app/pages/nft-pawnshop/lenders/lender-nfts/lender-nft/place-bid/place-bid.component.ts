import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NftPawnshopApplicationService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.application.service';
import { PlaceBidRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  BidderBids200ResponseBidsInner,
  ListedNfts200ResponseListingsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-place-bid',
  templateUrl: './place-bid.component.html',
  styleUrls: ['./place-bid.component.css'],
})
export class PlaceBidComponent implements OnInit {
  classID$: Observable<string>;
  nftID$: Observable<string>;
  listingInfo$: Observable<ListedNfts200ResponseListingsInner>;
  bidders$: Observable<BidderBids200ResponseBidsInner[]>;
  nftMetadata$: Observable<Metadata>;
  nftImage$: Observable<string>;
  chartData$: Observable<(string | number | Date)[][]>;

  constructor(
    private route: ActivatedRoute,
    private readonly pawnshop: NftPawnshopService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
    private readonly pawnshopApp: NftPawnshopApplicationService,
  ) {
    this.classID$ = this.route.params.pipe(map((params) => params.class_id));
    this.nftID$ = this.route.params.pipe(map((params) => params.nft_id));
    const nftCombine$ = combineLatest([this.classID$, this.nftID$]);
    this.listingInfo$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getNftListing(classID, nftID)),
    );
    this.bidders$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.listNftBids(classID, nftID)),
    );
    const nftData$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getNft(classID, nftID)),
    );
    this.nftMetadata$ = nftData$.pipe(
      mergeMap((nft) => this.pawnshop.getMetadataFromUri(nft.nft?.uri || '')),
    );
    this.nftImage$ = nftData$.pipe(
      mergeMap((nft) => this.pawnshop.getImageFromUri(nft.nft?.uri || '')),
    );

    // To Do : Add charts data source
    const primaryColor = '#007bff';
    this.chartData$ = this.bidders$.pipe(
      map((bidders) =>
        bidders.map((bidder) => {
          if (
            bidder.bidding_period &&
            bidder.bid_amount &&
            bidder.bid_amount.amount &&
            bidder.deposit_lending_rate
          ) {
            const date = new Date(bidder.bidding_period).toLocaleString();
            const bidAmount = Number(bidder.bid_amount.amount) / 1000000;
            const rate = (Number(bidder.deposit_lending_rate) * 100).toFixed(2) + '%';
            return [date, bidAmount, primaryColor, rate];
          } else {
            return [];
          }
        }),
      ),
      map((data) => data.sort((a, b) => Number(a[1]) - Number(b[1]))),
    );
  }

  ngOnInit(): void {}

  onSimulate(data: PlaceBidRequest) {
    // To Do Change Chart's data source
    const bidAmount = data.bidAmount;
    const date = data.biddingPeriod.toLocaleString();
    const rate = data.depositLendingRate;
    const secondaryColor = '#6c757d';
    this.chartData$ = this.chartData$.pipe(
      map((data) => {
        let newData = data.slice();
        newData[newData.length] = [date, bidAmount, secondaryColor, rate];
        return newData;
      }),
      map((data) => data.sort((a, b) => Number(a[1]) - Number(b[1]))),
    );
  }

  onSubmit(data: PlaceBidRequest) {
    this.pawnshopApp.placeBid(
      data.classID,
      data.nftID,
      data.symbol,
      data.bidAmount,
      data.biddingPeriod,
      data.depositLendingRate / 100,
      data.autoPayment,
      data.depositAmount,
    );
  }
}
