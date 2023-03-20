import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Nfts } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { forkJoin, Observable } from 'rxjs';
import { concatMap, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { ListedNfts200ResponseListingsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.css'],
})
export class BorrowerComponent implements OnInit {
  address$: Observable<string>;
  ownNfts$: Observable<Nfts>;
  ownNftImages$: Observable<string[]>;
  ownNftsMetadata$: Observable<Metadata[]>;
  listedOwnNfts$: Observable<ListedNfts200ResponseListingsInner[]>;
  listedOwnNftImages$: Observable<string[]>;
  listedOwnNftsMetadata$: Observable<Metadata[]>;

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
    this.ownNftImages$ = this.ownNfts$.pipe(
      mergeMap((value) => this.pawnshop.listNftImages(value)),
    );
    this.ownNftsMetadata$ = this.ownNfts$.pipe(
      mergeMap((value) => this.pawnshop.listNftsMetadata(value)),
    );

    this.listedOwnNfts$ = this.address$.pipe(
      mergeMap((address) =>
        this.pawnshopQuery
          .listAllListedNfts$()
          .pipe(map((nfts) => nfts.filter((nft) => nft.owner == address))),
      ),
    );

    const ownNftsUri$ = this.listedOwnNfts$.pipe(
      mergeMap((nfts) =>
        Promise.all(
          nfts.map(async (nft) => {
            if (nft.nft_id && nft.nft_id.class_id && nft.nft_id.nft_id) {
              const res = await this.pawnshopQuery.getNft(nft.nft_id.class_id, nft.nft_id.nft_id);
              return res.nft?.uri;
            } else {
              return '';
            }
          }),
        ),
      ),
    );

    this.listedOwnNftImages$ = ownNftsUri$.pipe(
      mergeMap((uris) =>
        Promise.all(
          uris.map(async (uri) => {
            const imageUri = await this.pawnshop.getImageFromUri(uri!);
            return imageUri;
          }),
        ),
      ),
    );

    this.listedOwnNftsMetadata$ = ownNftsUri$.pipe(
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
