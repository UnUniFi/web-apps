import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
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
  @Input()
  classImage?: string | null;
  @Input()
  nftsMetadata?: Metadata[] | null;
  @Input()
  nftImages?: string[] | null;
  @Output()
  appSubmit: EventEmitter<string>;

  constructor() {
    this.appSubmit = new EventEmitter();
  }

  ngOnInit(): void {}

  onSubmit(nftID: string) {
    this.appSubmit.emit(nftID);
  }
}
