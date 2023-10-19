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
  @Output()
  appDownloadCSV: EventEmitter<{}> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  downloadCSV() {
    this.appDownloadCSV.emit();
  }
}
