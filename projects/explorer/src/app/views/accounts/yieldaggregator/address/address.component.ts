import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import ununificlient from 'ununifi-client';

@Component({
  selector: 'view-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
})
export class AddressComponent implements OnInit {
  @Input()
  address?: string | null;
  @Input()
  depositMsgs?:
    | {
        txHash: string;
        height: string;
        timestamp: string;
        msg: ununificlient.proto.ununifi.yieldaggregator.MsgDepositToVault;
      }[]
    | null;
  @Input()
  withdrawMsgs?:
    | {
        txHash: string;
        height: string;
        timestamp: string;
        msg: ununificlient.proto.ununifi.yieldaggregator.MsgWithdrawFromVault;
      }[]
    | null;
  @Input()
  tvl?: {
    vaultBalances: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined;
    values: number[];
    tvl: number;
  } | null;
  @Output()
  appDownloadDeposits: EventEmitter<string> = new EventEmitter();
  @Output()
  appDownloadDepositMsgs: EventEmitter<string> = new EventEmitter();
  @Output()
  appDownloadWithdrawalMsgs: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  downloadDeposits() {
    if (!this.address) {
      alert('Invalid address');
      return;
    }
    this.appDownloadDeposits.emit();
  }
  downloadDepositMsgs() {
    if (!this.address) {
      alert('Invalid address');
      return;
    }
    this.appDownloadDepositMsgs.emit();
  }
  downloadWithdrawalMsgs() {
    if (!this.address) {
      alert('Invalid address');
      return;
    }
    this.appDownloadWithdrawalMsgs.emit();
  }
}
