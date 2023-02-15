import { StoredWallet } from '../../../../models/wallets/wallet.model';
import { WalletService } from '../../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { Observable, pipe } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ListedNfts200ResponseListingsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-lender',
  templateUrl: './lender.component.html',
  styleUrls: ['./lender.component.css'],
})
export class LenderComponent implements OnInit {
  address$: Observable<string>;
  biddingNfts$: Observable<ListedNfts200ResponseListingsInner[]>;
  nftsMetadata$: Observable<Metadata[]>;
  nftImages$: Observable<string[]>;

  constructor(
    private readonly walletService: WalletService,
    private readonly pawnshop: NftPawnshopService,
    private readonly pawnshopQueryService: NftPawnshopQueryService,
  ) {
    const currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.address$ = currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address).toString()),
    );
    const bidderBids = this.address$.pipe(
      mergeMap((address) => this.pawnshopQueryService.listBidderBids$(address)),
    );
    this.biddingNfts$ = bidderBids.pipe(
      mergeMap((bids) =>
        Promise.all(
          bids.map(
            async (bid) =>
              await this.pawnshopQueryService
                .getNftListing$(bid.nft_id?.class_id!, bid.nft_id?.nft_id!)
                .toPromise(),
          ),
        ),
      ),
    );

    const nfts$ = this.biddingNfts$.pipe(
      mergeMap((nfts) => {
        return Promise.all(
          nfts.map(async (nft) => {
            if (!nft.nft_id?.class_id || !nft.nft_id?.nft_id) {
              return {};
            }
            const nftData = await this.pawnshopQueryService
              .getNft$(nft.nft_id.class_id, nft.nft_id?.nft_id)
              .toPromise();
            return nftData;
          }),
        );
      }),
    );

    this.nftsMetadata$ = nfts$.pipe(
      mergeMap((nfts) => {
        return Promise.all(
          nfts.map(async (nft) => {
            const imageUri = await this.pawnshop.getMetadataFromUri(nft.nft?.uri || '');
            return imageUri;
          }),
        );
      }),
    );

    this.nftImages$ = nfts$.pipe(
      mergeMap((nfts) => {
        return Promise.all(
          nfts.map(async (nft) => {
            const imageUri = await this.pawnshop.getImageFromUri(nft.nft?.uri || '');
            return imageUri;
          }),
        );
      }),
    );
  }

  ngOnInit(): void {}
}
