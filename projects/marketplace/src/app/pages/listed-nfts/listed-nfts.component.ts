import { UnunifiRestService } from '../../models/ununifi-rest.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ListedClass200Response } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-listed-nfts',
  templateUrl: './listed-nfts.component.html',
  styleUrls: ['./listed-nfts.component.css'],
})
export class ListedNftsComponent implements OnInit {
  listedClasses$: Observable<ListedClass200Response[]>;
  classImages$: Observable<string[]>;

  constructor(private http: HttpClient, private ununifiRest: UnunifiRestService) {
    this.listedClasses$ = this.ununifiRest.getAllListedClasses();
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

  replaceIpfs(url: string) {
    return url.replace('ipfs://', 'https://ununifi.mypinata.cloud/ipfs/');
  }

  getMetadataFromUri(uri: string): Promise<Metadata> {
    return this.http.get(uri).toPromise();
  }
}
