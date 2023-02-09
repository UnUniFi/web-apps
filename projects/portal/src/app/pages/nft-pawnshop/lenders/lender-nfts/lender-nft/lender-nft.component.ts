import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  BidderBids200ResponseBidsInner,
  ListedNfts200ResponseListingsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-lender-nft',
  templateUrl: './lender-nft.component.html',
  styleUrls: ['./lender-nft.component.css'],
})
export class LenderNftComponent implements OnInit {
  address$: Observable<string>;
  classID$: Observable<string>;
  nftID$: Observable<string>;
  listingInfo$: Observable<ListedNfts200ResponseListingsInner>;
  bidders$: Observable<BidderBids200ResponseBidsInner[]>;
  nftMetadata$: Observable<Metadata>;
  nftImage$: Observable<string>;
  isBided$: Observable<boolean>;
  isWinning$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private readonly walletService: WalletService,

    private readonly pawnshop: NftPawnshopService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
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
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getNftListing(classID, nftID)),
    );
    this.bidders$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.listNftBids(classID, nftID)),
      map((bidders) =>
        bidders.sort(
          (first, second) =>
            parseInt(second.bid_amount?.amount!) - parseInt(first.bid_amount?.amount!),
        ),
      ),
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
    this.isBided$ = combineLatest([this.address$, this.bidders$]).pipe(
      map(([address, bidders]) => {
        const bidder = bidders.find((bidder) => bidder.bidder == address);
        return !!bidder;
      }),
    );
    // To Do Add Liquidate
    this.isWinning$ = combineLatest([this.address$, this.bidders$, this.listingInfo$]).pipe(
      map(([address, bidders, info]) => {
        if (info.state == 'SELLING_DECISION') {
          if (bidders[0].bidder == address) {
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
}
