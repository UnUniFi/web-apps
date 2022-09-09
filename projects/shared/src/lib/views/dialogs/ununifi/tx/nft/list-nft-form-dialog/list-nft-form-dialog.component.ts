import { GasSetting } from '../../../../../../models/cosmos/tx/common/tx-common.model';
import { Nft } from '../../../../../../models/ununifi/query/nft/nft.model';
import { MsgListNftData } from '../../../../../../models/ununifi/tx/nft/nft-tx.model';
import { StoredWallet } from '../../../../../../models/wallets/wallet.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import * as crypto from 'crypto';
import Long from 'long';

export type MsgListNftFormData = {
  msgData: MsgListNftData;
  gasSetting: GasSetting;
};

@Component({
  selector: 'lib-view-list-nft-form-dialog',
  templateUrl: './list-nft-form-dialog.component.html',
  styleUrls: ['./list-nft-form-dialog.component.css'],
})
export class LibViewListNftFormDialogComponent implements OnInit {
  @Input() nft?: Nft | null;

  @Input() currentStoredWallet?: StoredWallet | null;
  @Input() coins?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input() uguuBalance?: string | null;
  @Input() minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  @Output() appSubmit: EventEmitter<MsgListNftFormData>;

  selectedGasPrice?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  availableDenoms?: string[];
  selectedAmount?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;

  listingType: string;
  bidToken: string;
  minBid: string;
  bidHook: string;

  constructor() {
    this.appSubmit = new EventEmitter();
    this.availableDenoms = ['uguu'];
    this.gasRatio = 0;

    this.listingType = 'DIRECT_ASSET_BORROW';
    this.bidToken = 'uguu';
    this.minBid = '1';
    this.bidHook = '2';
  }

  ngOnChanges(): void {
    if (this.minimumGasPrices && this.minimumGasPrices.length > 0) {
      this.selectedGasPrice = this.minimumGasPrices[0];
    }
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

  changeGasRatio(ratio: number) {
    this.gasRatio = ratio;
  }

  onSubmit() {
    if (
      !this.currentStoredWallet ||
      !this.selectedGasPrice ||
      !this.currentStoredWallet.address ||
      !this.nft?.nft_class.id ||
      !this.nft?.id
    ) {
      return;
    }
    this.appSubmit.emit({
      msgData: {
        sender: this.currentStoredWallet.address,
        nft_id: {
          class_id: this.nft.nft_class.id,
          nft_id: this.nft.id,
        },
        listing_type: 'DIRECT_ASSET_BORROW',
        bid_token: this.bidToken,
        min_bid: this.minBid,
        bid_hook: Long.fromString(this.bidHook),
      },
      gasSetting: { minimumGasPrice: this.selectedGasPrice, gasRatio: this.gasRatio },
    });
  }

  onMinimumGasDenomChanged(denom: string): void {
    this.selectedGasPrice = this.minimumGasPrices?.find(
      (minimumGasPrice) => minimumGasPrice.denom === denom,
    );
  }

  onMinimumGasAmountSliderChanged(amount: string): void {
    if (this.selectedGasPrice) {
      this.selectedGasPrice.amount = amount;
    }
  }
}
