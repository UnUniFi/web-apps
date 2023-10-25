import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { NftPawnshopApplicationService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.application.service';
import { NftRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { Metadata } from 'projects/portal/src/app/models/nft/nft.model';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  Loan200Response,
  Liquidation200ResponseLiquidations,
  ListedNfts200ResponseListingsInnerListing,
  NftBids200ResponseBidsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-nft',
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.css'],
})
export class NftComponent implements OnInit {
  address$: Observable<string>;
  classID$: Observable<string>;
  nftID$: Observable<string>;
  listingInfo$: Observable<ListedNfts200ResponseListingsInnerListing>;
  bids$: Observable<NftBids200ResponseBidsInner[]>;
  loan$: Observable<Loan200Response>;
  liquidation$: Observable<Liquidation200ResponseLiquidations>;
  nftMetadata$: Observable<Metadata>;
  nftImage$: Observable<string>;
  ownBid$: Observable<NftBids200ResponseBidsInner | undefined>;
  isWinning$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly pawnshop: NftPawnshopService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
    private readonly pawnshopApp: NftPawnshopApplicationService,
  ) {
    const currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.address$ = currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address).toString()),
    );

    this.classID$ = this.route.params.pipe(map((params) => params.class_id));
    this.nftID$ = this.route.params.pipe(map((params) => params.nft_id));
    const nftCombine$ = combineLatest([this.classID$, this.nftID$]);
    this.listingInfo$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getListedNft$(classID, nftID)),
    );
    this.bids$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.listNftBids$(classID, nftID)),
      map((bidders) =>
        bidders.sort((a, b) => parseInt(b.price?.amount!) - parseInt(a.price?.amount!)),
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
    this.ownBid$ = combineLatest([this.address$, this.bids$]).pipe(
      map(([address, bidders]) => {
        const bidder = bidders.find((bidder) => bidder.id?.bidder == address);
        return bidder;
      }),
    );
    // To Do Add Liquidate
    this.isWinning$ = combineLatest([this.address$, this.bids$, this.listingInfo$]).pipe(
      map(([address, bidders, info]) => {
        if (info.state == 'SELLING_DECISION') {
          if (bidders[0].id?.bidder == address) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }),
    );
  }

  ngOnInit(): void {}

  onSubmitCancelListing(data: NftRequest) {
    this.pawnshopApp.cancelNftListing(data.classID, data.nftID);
  }

  onSubmitSell(data: NftRequest) {
    this.pawnshopApp.sellingDecision(data.classID, data.nftID);
  }

  onSubmitCancelBid(data: NftRequest) {
    this.pawnshopApp.cancelBid(data.classID, data.nftID);
  }

  onSubmitPayRemainder(data: NftRequest) {
    this.pawnshopApp.PayRemainder(data.classID, data.nftID);
  }
}
