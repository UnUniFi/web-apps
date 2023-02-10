import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { Observable, combineLatest } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
import {
  ListedNfts200ResponseListingsInner,
  BidderBids200ResponseBidsInner,
  Loan200Response,
  Liquidation200ResponseLiquidations,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-borrower-nft',
  templateUrl: './borrower-nft.component.html',
  styleUrls: ['./borrower-nft.component.css'],
})
export class BorrowerNftComponent implements OnInit {
  classID$: Observable<string>;
  nftID$: Observable<string>;
  listingInfo$: Observable<ListedNfts200ResponseListingsInner>;
  bidders$: Observable<BidderBids200ResponseBidsInner[]>;
  loan$: Observable<Loan200Response>;
  liquidation$: Observable<Liquidation200ResponseLiquidations>;
  nftMetadata$: Observable<Metadata>;
  nftImage$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private readonly pawnshop: NftPawnshopService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
  ) {
    this.classID$ = this.route.params.pipe(map((params) => params.class_id));
    this.nftID$ = this.route.params.pipe(map((params) => params.nft_id));
    const nftCombine$ = combineLatest([this.classID$, this.nftID$]);
    this.listingInfo$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getNftListing(classID, nftID)),
    );
    this.bidders$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.listNftBids(classID, nftID)),
      map((bidders) =>
        bidders.sort((first, second) => {
          if (parseInt(first.bid_amount?.amount!) > parseInt(second.bid_amount?.amount!)) {
            return -1;
          } else if (parseInt(first.bid_amount?.amount!) < parseInt(second.bid_amount?.amount!)) {
            return 1;
          } else {
            return 0;
          }
        }),
      ),
    );
    this.loan$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getLoan(classID, nftID)),
    );
    this.liquidation$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getLiquidation(classID, nftID)),
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
  }

  ngOnInit(): void {}
}
