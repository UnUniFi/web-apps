import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import cosmosclient from '@cosmos-client/core';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ListedClass200Response } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-nfts-dialog',
  templateUrl: './nfts-dialog.component.html',
  styleUrls: ['./nfts-dialog.component.css'],
})
export class NftsDialogComponent implements OnInit {
  classID: string | undefined;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  coins$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  uguuBalance$: Observable<string>;
  listedClass$: Observable<ListedClass200Response>;
  classImage$: Observable<string>;
  nftsMetadata$: Observable<Metadata[]>;
  nftImages$: Observable<string[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: string,
    public matDialogRef: MatDialogRef<NftsDialogComponent>,
    private readonly walletService: WalletService,
    private readonly cosmosRest: CosmosRestService,
    private readonly pawnshop: NftPawnshopService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
  ) {
    this.classID = data;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );
    this.coins$ = address$.pipe(mergeMap((address) => this.cosmosRest.getAllBalances$(address)));
    this.uguuBalance$ = this.coins$.pipe(
      map((coins) => {
        const balance = coins?.find((coin) => coin.denom == 'uguu');
        return balance ? balance.amount! : '0';
      }),
    );
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
    this.nftsMetadata$ = this.listedClass$.pipe(
      mergeMap((value) => this.pawnshop.listNftsMetadata(value)),
    );
    this.nftImages$ = this.listedClass$.pipe(
      mergeMap((value) => this.pawnshop.listNftImages(value)),
    );
  }

  ngOnInit(): void {}

  async onSubmit(nftID: string) {
    this.matDialogRef.close(nftID);
  }
}
