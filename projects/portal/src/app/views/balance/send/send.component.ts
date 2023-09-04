import { BankSendRequest } from '../../../models/cosmos/bank.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';

@Component({
  selector: 'view-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
})
export class SendComponent implements OnInit {
  @Input() address?: string | null;
  @Input() toAddress?: string | null;
  @Input() selectedTokens?: { denom: string; readableAmount?: number }[] | null;
  @Input() symbolImageMap?: { [symbol: string]: string };
  @Input() denomBalancesMap?: {
    [denom: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  } | null;
  @Input() denomMetadataMap?: {
    [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata;
  } | null;

  @Output() appSend: EventEmitter<BankSendRequest>;

  selectedDenom?: string;

  constructor() {
    this.appSend = new EventEmitter();
  }

  ngOnInit(): void {}

  isAlreadySelectedDenom(denom?: string) {
    return this.selectedTokens?.some((s) => s.denom === denom);
  }

  onClickAddToken() {
    if (!this.selectedDenom) {
      alert('Please select a token.');
      return;
    }
    this.selectedTokens?.push({
      denom: this.selectedDenom,
    });
    this.selectedTokens?.sort((a, b) => a.denom!.localeCompare(b.denom!));

    this.selectedDenom = undefined;
  }

  number(value: string) {
    return Number(value);
  }

  onClickDeleteToken(index: number) {
    this.selectedTokens?.splice(index, 1);
  }

  onSubmitSend() {
    if (!this.toAddress) {
      return;
    }

    const denomReadableAmountMap: { [denom: string]: number } = {};
    this.selectedTokens?.forEach((s) => {
      if (s.readableAmount) {
        denomReadableAmountMap[s.denom] = s.readableAmount;
      }
    });

    this.appSend.emit({ toAddress: this.toAddress, denomReadableAmountMap });
  }
}
