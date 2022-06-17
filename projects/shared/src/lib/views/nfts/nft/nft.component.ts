import { Nft } from '../../../models/ununifi/query/nft/nft.model';
import { NftTxApplicationService } from '../../../models/ununifi/tx/nft/nft-tx.application.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-view-nft',
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.css'],
})
export class LibViewNftComponent implements OnInit {
  @Input() nft?: Nft | null;
  @Input() menuEnabled?: boolean;

  constructor(private readonly nftTxApplicationService: NftTxApplicationService) {}

  ngOnInit(): void {}

  onClickButton() {
    if (this.menuEnabled) {
      if (!this.nft) {
        return;
      }
      this.nftTxApplicationService.openNftMenuDialog(this.nft);
    }
  }
}
