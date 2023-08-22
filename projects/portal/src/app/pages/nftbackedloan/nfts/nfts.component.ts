import { NftPawnshopQueryService } from '../../../models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from '../../../models/nft-pawnshops/nft-pawnshop.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { Observable, combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ListedNfts200ResponseListingsInner } from 'ununifi-client/esm/openapi';

export type SearchInfo = {
  keyword?: string;
  state?: string;
  date?: string;
  time?: string;
  minExpiryDate?: number;
};
@Component({
  selector: 'app-nfts',
  templateUrl: './nfts.component.html',
  styleUrls: ['./nfts.component.css'],
})
export class NftsComponent implements OnInit {
  listedNfts$: Observable<ListedNfts200ResponseListingsInner[]>;
  nftsMetadata$: Observable<Metadata[]>;
  images$: Observable<string[]>;
  keyword$: Observable<string>;
  state$: Observable<string>;
  date$: Observable<string>;
  time$: Observable<string>;
  minExpiryDate$: Observable<number>;
  isSearchBoxOpened$: Observable<boolean>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly pawnshopService: NftPawnshopService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
  ) {
    this.listedNfts$ = combineLatest([
      this.pawnshopQuery.listAllListedNfts$(),
      this.route.queryParams,
    ]).pipe(
      map(([nfts, params]) => {
        const keyword = params.keyword;
        const state = params.state;
        const date = params.date;
        const time = params.time;
        const minExpiryDate = params.minExpiryDate;
        if (keyword) {
          nfts = nfts.filter(
            (nft) =>
              nft.listing?.owner?.includes(keyword) ||
              nft.listing?.nft_id?.class_id?.includes(keyword) ||
              nft.listing?.nft_id?.token_id?.includes(keyword),
          );
        }
        if (state) {
          nfts = nfts.filter((nft) => nft.listing?.state === state);
        }
        if (date) {
          const searchDate = time ? new Date(date + 'T' + time) : new Date(date);
          nfts = nfts.filter((nft) => new Date(nft.listing?.started_at!) > searchDate);
        }
        if (minExpiryDate) {
          nfts = nfts.filter(
            (nft) =>
              Number(nft.listing?.min_bid_period?.replace('s', '')) >
              Number(minExpiryDate) * 24 * 60 * 60,
          );
        }
        return nfts;
      }),
    );
    this.listedNfts$.subscribe((nfts) => console.log(nfts));
    this.keyword$ = this.route.queryParams.pipe(map((params) => params.keyword));
    this.state$ = this.route.queryParams.pipe(map((params) => params.state));
    this.date$ = this.route.queryParams.pipe(map((params) => params.date));
    this.time$ = this.route.queryParams.pipe(map((params) => params.time));
    this.minExpiryDate$ = this.route.queryParams.pipe(map((params) => params.minExpiryDate));
    this.isSearchBoxOpened$ = this.route.queryParams.pipe(
      map((params) => params.keyword || params.state || params.date || params.time),
    );
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

  appSearchNfts(searchInfo: SearchInfo): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        keyword: searchInfo.keyword,
        state: searchInfo.state,
        date: searchInfo.date,
        time: searchInfo.time,
        minExpiryDate: searchInfo.minExpiryDate,
      },
      queryParamsHandling: 'merge',
    });
  }

  appRefreshPage() {
    this.router.navigate([], {
      relativeTo: this.route,
    });
  }
}
