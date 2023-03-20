import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type MintNftEvent = {
  classId: string;
  nftId: string;
  recipient: string;
};

@Component({
  selector: 'view-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css'],
})
export class MintComponent implements OnInit {
  @Input()
  address?: string | null;
  @Input()
  classes?: string[] | null;
  @Input()
  selectedClass?: string | null;

  @Output()
  mintNft = new EventEmitter<MintNftEvent>();

  nftId?: string;

  constructor() {
    this.autoID();
  }

  ngOnInit(): void {}

  autoID() {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let autoID = 'a';

    for (let i = 0; i < 20; i++) {
      autoID += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    this.nftId = autoID;
  }

  onSubmitNftMint() {
    if (this.address && this.selectedClass && this.nftId) {
      this.mintNft.emit({
        recipient: this.address,
        classId: this.selectedClass,
        nftId: this.nftId,
      });
    } else {
      alert('Invalid parameters!');
    }
  }
}
