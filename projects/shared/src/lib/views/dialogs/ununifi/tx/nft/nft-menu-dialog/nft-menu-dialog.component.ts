import { Nft } from '../../../../../../models/ununifi/query/nft/nft.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lib-view-nft-menu-dialog',
  templateUrl: './nft-menu-dialog.component.html',
  styleUrls: ['./nft-menu-dialog.component.css'],
})
export class LibViewNftMenuDialogComponent implements OnInit {
  @Input() nft?: Nft;

  @Output() appClickListNftButton: EventEmitter<Nft>;

  constructor() {
    this.appClickListNftButton = new EventEmitter();
  }

  ngOnInit(): void {}

  onClickListNftButton() {
    if (!this.nft) {
      return;
    }
    this.appClickListNftButton.emit(this.nft);
  }
}
