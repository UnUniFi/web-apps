import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import * as crypto from 'crypto';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { ListedClass200Response } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-nfts-dialog',
  templateUrl: './nfts-dialog.component.html',
  styleUrls: ['./nfts-dialog.component.css'],
})
export class NftsDialogComponent implements OnInit {
  @Input()
  classID: string | undefined;
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  coins?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  uguuBalance?: string | null;
  @Input()
  listedClass?: ListedClass200Response | null;
  @Output()
  appSubmit: EventEmitter<string>;

  constructor() {
    this.appSubmit = new EventEmitter();
  }

  ngOnInit(): void {}

  getColorCode(address: string) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(address ?? ''))
      .digest()
      .toString('hex');
    return `#${hash.substr(0, 6)}`;
  }

  onSummit(nftID: string) {
    this.appSubmit.emit(nftID);
  }
}
