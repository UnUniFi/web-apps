import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { NftPawnshopApplicationService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.application.service';
import { NftRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { Observable, combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
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
  symbol$: Observable<string | null | undefined>;
  symbolImage$: Observable<string | undefined>;
  bidders$: Observable<BidderBids200ResponseBidsInner[]>;
  loan$: Observable<Loan200Response>;
  liquidation$: Observable<Liquidation200ResponseLiquidations>;
  nftMetadata$: Observable<Metadata>;
  nftImage$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private readonly bankQuery: BankQueryService,
    private readonly pawnshop: NftPawnshopService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
    private readonly pawnshopApp: NftPawnshopApplicationService,
  ) {
    this.classID$ = this.route.params.pipe(map((params) => params.class_id));
    this.nftID$ = this.route.params.pipe(map((params) => params.nft_id));
    const nftCombine$ = combineLatest([this.classID$, this.nftID$]);
    this.listingInfo$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getNftListing$(classID, nftID)),
    );
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.symbol$ = combineLatest([this.listingInfo$, denomMetadataMap$]).pipe(
      map(([info, metadata]) => metadata[info.bid_token || ''].symbol),
    );
    this.symbolImage$ = this.symbol$.pipe(
      map((symbol) => this.bankQuery.symbolImages().find((i) => i.symbol === symbol)?.image),
    );
    this.bidders$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.listNftBids$(classID, nftID)),
      map((bidders) =>
        bidders.sort((a, b) => parseInt(b.bid_amount?.amount!) - parseInt(a.bid_amount?.amount!)),
      ),
    );
    this.loan$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getLoan$(classID, nftID)),
    );
    this.liquidation$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getLiquidation$(classID, nftID)),
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
  }

  ngOnInit(): void {}

  onSubmitCancel(data: NftRequest) {
    this.pawnshopApp.cancelNftListing(data.classID, data.nftID);
  }

  onSubmitSell(data: NftRequest) {
    this.pawnshopApp.sellingDecision(data.classID, data.nftID);
  }
}
