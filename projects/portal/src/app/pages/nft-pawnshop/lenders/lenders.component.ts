import { PawnshopQueryService } from '../../../models/nft-pawnshops/nft-pawnshop.query.service';
import { BalanceUsecaseService } from '../../balance/balance.usecase.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
  ListedClass200Response,
  ListedNfts200ResponseListingsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-lenders',
  templateUrl: './lenders.component.html',
  styleUrls: ['./lenders.component.css'],
})
export class LendersComponent implements OnInit {
  balances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null | undefined>;
  listedClasses$: Observable<ListedClass200Response[]>;
  classImages$: Observable<string[]>;
  listedNfts$: Observable<ListedNfts200ResponseListingsInner[]>;

  constructor(
    private usecase: BalanceUsecaseService,
    private http: HttpClient,
    private readonly pawnshopQuery: PawnshopQueryService,
  ) {
    this.balances$ = this.usecase.balances$;
    this.listedNfts$ = this.pawnshopQuery.listListedNfts();
    this.listedClasses$ = this.pawnshopQuery.getAllListedClasses();
    this.classImages$ = this.listedClasses$.pipe(
      mergeMap((classes) =>
        Promise.all(
          classes.map((nftClass) => {
            if (!nftClass.uri) {
              return '';
            }
            const uri = this.replaceIpfs(nftClass.uri);
            return this.getMetadataFromUri(uri).then((metadata) => {
              if (!metadata.image) {
                return '';
              }
              return this.replaceIpfs(metadata.image);
            });
          }),
        ),
      ),
    );
  }

  ngOnInit(): void {}

  replaceIpfs(url: string): string {
    return url.replace('ipfs://', 'https://ununifi.mypinata.cloud/ipfs/');
  }

  async getMetadataFromUri(uri: string): Promise<Metadata> {
    const metadata = await this.http.get(uri).toPromise();
    return metadata;
  }
}
