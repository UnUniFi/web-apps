import { BankSendRequest } from '../../../models/cosmos/bank.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'view-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
})
export class SendComponent implements OnInit {
  @Input() address?: string | null;
  @Input() toAddress?: string | null;
  @Input() selectedTokens?: { symbol: string; amount?: number }[] | null;
  @Input() balanceSymbols?: string[] | null;
  @Input() symbolImageMap?: { [symbol: string]: string };
  @Input() symbolBalancesMap?: { [symbol: string]: number } | null;
  @Output() appSend: EventEmitter<BankSendRequest>;
  selectedSymbol?: string;

  constructor() {
    this.appSend = new EventEmitter();
  }

  ngOnInit(): void {}

  isAlreadySelectedSymbol(symbol: string) {
    return this.selectedTokens?.some((s) => s.symbol === symbol);
  }

  onClickAddToken() {
    if (!this.selectedSymbol) {
      alert('Please select a token.');
      return;
    }
    this.selectedTokens?.push({
      symbol: this.selectedSymbol,
    });
    this.selectedTokens?.sort((a, b) => a.symbol!.localeCompare(b.symbol!));

    this.selectedSymbol = undefined;
  }

  onClickDeleteToken(index: number) {
    this.selectedTokens?.splice(index, 1);
  }

  onSubmitSend() {
    if (!this.toAddress) {
      return;
    }
    const amounts = this.selectedTokens?.filter((s) => s.amount) as {
      symbol: string;
      amount: number;
    }[];
    this.appSend.emit({ toAddress: this.toAddress, symbolAmounts: amounts });
  }
}
