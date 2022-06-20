import { Nft } from '../../../../../models/ununifi/query/nft/nft.model';
import { NftTxApplicationService } from '../../../../../models/ununifi/tx/nft/nft-tx.application.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-widget-delegate-menu-dialog',
  templateUrl: './nft-menu-dialog.component.html',
  styleUrls: ['./nft-menu-dialog.component.css'],
})
export class LibWidgetNftMenuDialogComponent implements OnInit {
  nft: Nft;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: Nft,
    private router: Router,
    public matDialogRef: MatDialogRef<LibWidgetNftMenuDialogComponent>,
    private readonly nftTxApplicationService: NftTxApplicationService,
  ) {
    this.nft = data;
  }

  ngOnInit() {}

  async onSubmitListNft(nft: Nft) {
    this.matDialogRef.close();
    await this.nftTxApplicationService.openListNftFormDialog(nft);
  }
}
