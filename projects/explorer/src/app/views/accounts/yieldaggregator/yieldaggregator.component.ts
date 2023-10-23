import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';

@Component({
  selector: 'view-yieldaggregator',
  templateUrl: './yieldaggregator.component.html',
  styleUrls: ['./yieldaggregator.component.css'],
})
export class YieldaggregatorComponent implements OnInit {
  @Input()
  depositors?: string[] | null;
  @Input()
  addressTVLs?:
    | {
        address: string;
        vaultBalances: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined;
        values: number[];
        tvl: number;
      }[]
    | null;
  @Input()
  msgs?:
    | {
        type: string;
        txHash: string;
        height: string;
        timestamp: string;
        sender: string;
        vaultId: string;
        amount: string;
      }[]
    | null;
  @Output()
  appDownloadTVLs: EventEmitter<{}> = new EventEmitter();
  @Output()
  appDownloadMsgs: EventEmitter<{}> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  downloadTVLs() {
    this.appDownloadTVLs.emit();
  }
  downloadMsgs() {
    this.appDownloadMsgs.emit();
  }
}
