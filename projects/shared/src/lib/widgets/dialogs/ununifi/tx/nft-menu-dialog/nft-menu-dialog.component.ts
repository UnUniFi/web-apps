import { Nft } from '../../../../../models/ununifi/query/nft/nft.model';
import { NftTxApplicationService } from '../../../../../models/ununifi/tx/nft/nft-tx.application.service';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-widget-delegate-menu-dialog',
  templateUrl: './nft-menu-dialog.component.html',
  styleUrls: ['./nft-menu-dialog.component.css'],
})
export class LibWidgetNftMenuDialogComponent implements OnInit {
  nft: Nft;

  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: Nft,
    private router: Router,
    public dialogRef: DialogRef<LibWidgetNftMenuDialogComponent>,
    private readonly nftTxApplicationService: NftTxApplicationService,
  ) {
    this.nft = data;
  }

  ngOnInit() {}

  async onSubmitListNft(nft: Nft) {
    this.dialogRef.close();
    await this.nftTxApplicationService.openListNftFormDialog(nft);
  }
}
