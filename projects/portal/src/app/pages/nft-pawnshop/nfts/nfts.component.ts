import { NftPawnshopQueryService } from '../../../models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from '../../../models/nft-pawnshops/nft-pawnshop.service';
import { Component, OnInit } from '@angular/core';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ListedNfts200ResponseListingsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-nfts',
  templateUrl: './nfts.component.html',
  styleUrls: ['./nfts.component.css'],
})
export class NftsComponent implements OnInit {
  listedNfts$: Observable<ListedNfts200ResponseListingsInner[]>;
  nftsMetadata$: Observable<Metadata[]>;
  images$: Observable<string[]>;

  constructor(
    private readonly pawnshopService: NftPawnshopService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
  ) {
    this.listedNfts$ = this.pawnshopQuery.listAllListedNfts$();
    const uris$ = this.listedNfts$.pipe(map((nfts) => nfts.map((nft) => nft.nft_info?.uri)));
    this.nftsMetadata$ = uris$.pipe(
      mergeMap((uris) =>
        Promise.all(
          uris.map(async (uri) => {
            if (!uri) {
              return {};
            }
            const metadata = await this.pawnshopService.getMetadataFromUri(uri);
            return metadata;
          }),
        ),
      ),
    );
    this.images$ = this.nftsMetadata$.pipe(
      map((metadata) => metadata.map((m) => this.pawnshopService.replaceIpfs(m.image || ''))),
    );
  }

  ngOnInit(): void {}
}
