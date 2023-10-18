import { Component, Input, OnInit } from '@angular/core';
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

  constructor() {}

  ngOnInit(): void {}
}
