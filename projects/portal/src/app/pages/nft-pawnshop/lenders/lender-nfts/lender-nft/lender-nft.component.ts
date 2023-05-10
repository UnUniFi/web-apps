import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { NftPawnshopApplicationService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.application.service';
import { NftRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  BidderBids200ResponseBidsInner,
  ListedNfts200ResponseListingsInnerListing,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-lender-nft',
  templateUrl: './lender-nft.component.html',
  styleUrls: ['./lender-nft.component.css'],
})
export class LenderNftComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  address$: Observable<string>;
  classID$: Observable<string>;
  nftID$: Observable<string>;
  symbol$: Observable<string | null | undefined>;
  symbolImage$: Observable<string | undefined>;
  listingInfo$: Observable<ListedNfts200ResponseListingsInnerListing>;
  bidders$: Observable<BidderBids200ResponseBidsInner[]>;
  nftMetadata$: Observable<Metadata>;
  nftImage$: Observable<string>;
  bidDetail$: Observable<BidderBids200ResponseBidsInner | undefined>;
  isWinning$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly pawnshop: NftPawnshopService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
    private readonly pawnshopApp: NftPawnshopApplicationService,
  ) {
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address).toString()),
    );

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
    const nftData$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getNft$(classID, nftID)),
    );
    this.nftMetadata$ = nftData$.pipe(
      mergeMap((nft) => this.pawnshop.getMetadataFromUri(nft.nft?.uri || '')),
    );
    this.nftImage$ = nftData$.pipe(
      mergeMap((nft) => this.pawnshop.getImageFromUri(nft.nft?.uri || '')),
    );
    this.bidDetail$ = combineLatest([this.address$, this.bidders$]).pipe(
      map(([address, bidders]) => {
        const bidder = bidders.find((bidder) => bidder.bidder == address);
        return bidder;
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

  onSubmitCancelBid(data: NftRequest) {
    this.pawnshopApp.cancelBid(data.classID, data.nftID);
  }

  onSubmitPayFullBid(data: NftRequest) {
    this.pawnshopApp.payFullBid(data.classID, data.nftID);
  }
}
