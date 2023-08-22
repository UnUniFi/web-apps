import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { NftInfo, Nfts } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ListedNfts200ResponseListingsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.css'],
})
export class BorrowerComponent implements OnInit {
  address$: Observable<string>;
  ownNfts$: Observable<Nfts>;
  listedOwnNfts$: Observable<ListedNfts200ResponseListingsInner[]>;
  listedOwnNftImages$: Observable<string[]>;
  listedOwnNftsMetadata$: Observable<Metadata[]>;
  notListedOwnNfts$: Observable<NftInfo[] | undefined>;
  notListedOwnNftImages$: Observable<string[]>;
  notListedOwnNftsMetadata$: Observable<Metadata[]>;

  constructor(
    private readonly walletService: WalletService,
    private readonly pawnshop: NftPawnshopService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
  ) {
    const currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.address$ = currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address).toString()),
    );
    this.ownNfts$ = this.address$.pipe(
      mergeMap((address) => this.pawnshopQuery.listOwnNfts$(address)),
    );

    this.listedOwnNfts$ = this.address$.pipe(
      mergeMap((address) =>
        this.pawnshopQuery
          .listAllListedNfts$()
          .pipe(map((nfts) => nfts.filter((nft) => nft.listing?.owner == address))),
      ),
    );
    this.notListedOwnNfts$ = combineLatest([this.ownNfts$, this.listedOwnNfts$]).pipe(
      map(([ownNfts, listedOwnNfts]) => {
        const listedOwnNftIds = listedOwnNfts.map((nft) => {
          return { classId: nft.listing?.nft_id?.class_id, tokenId: nft.listing?.nft_id?.token_id };
        });
        const filteredNfts = ownNfts.nfts?.filter(
          (nft) =>
            !listedOwnNftIds.some(
              (listedNft) => listedNft.classId == nft.class_id && listedNft.tokenId == nft.id,
            ),
        );
        return filteredNfts;
      }),
    );
    this.notListedOwnNftImages$ = this.notListedOwnNfts$.pipe(
      mergeMap((value) => this.pawnshop.listNftImages({ nfts: value })),
    );
    this.notListedOwnNftsMetadata$ = this.notListedOwnNfts$.pipe(
      mergeMap((value) => this.pawnshop.listNftsMetadata({ nfts: value })),
    );

    const listedOwnNftsUri$ = this.listedOwnNfts$.pipe(
      mergeMap((nfts) =>
        Promise.all(
          nfts.map(async (nft) => {
            if (nft.listing?.nft_id?.class_id && nft.listing?.nft_id?.token_id) {
              const res = await this.pawnshopQuery.getNft(
                nft.listing.nft_id.class_id,
                nft.listing.nft_id.token_id,
              );
              return res.nft?.uri;
            } else {
              return '';
            }
          }),
        ),
      ),
    );

    this.listedOwnNftImages$ = listedOwnNftsUri$.pipe(
      mergeMap((uris) =>
        Promise.all(
          uris.map(async (uri) => {
            const imageUri = await this.pawnshop.getImageFromUri(uri!);
            return imageUri;
          }),
        ),
      ),
    );

    this.listedOwnNftsMetadata$ = listedOwnNftsUri$.pipe(
      mergeMap((uris) =>
        Promise.all(
          uris.map(async (uri) => {
            const imageUri = await this.pawnshop.getMetadataFromUri(uri!);
            return imageUri;
          }),
        ),
      ),
    );
  }

  ngOnInit(): void {}
}
