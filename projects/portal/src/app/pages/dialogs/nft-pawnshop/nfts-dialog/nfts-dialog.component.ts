import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ListedClass200Response } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-nfts-dialog',
  templateUrl: './nfts-dialog.component.html',
  styleUrls: ['./nfts-dialog.component.css'],
})
export class NftsDialogComponent implements OnInit {
  classID: string | undefined;
  listedClass$: Observable<ListedClass200Response>;
  classImage$: Observable<string>;
  nftImages$: Observable<string[]>;

  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: string,
    public dialogRef: DialogRef<string, NftsDialogComponent>,
    private readonly pawnshop: NftPawnshopService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
  ) {
    this.classID = data;
    this.listedClass$ = this.pawnshopQuery.listListedClass$(this.classID, 100);
    this.classImage$ = this.listedClass$.pipe(
      mergeMap(async (value) => {
        if (!value.uri) {
          return '';
        }
        const imageUri = await this.pawnshop.getImageFromUri(value.uri);
        return imageUri;
      }),
    );
    this.nftImages$ = this.listedClass$.pipe(
      mergeMap((value) => this.pawnshop.listNftImages(value)),
    );
  }

  ngOnInit(): void {}

  async onSubmit(nftID: string) {
    this.dialogRef.close(nftID);
  }
}
