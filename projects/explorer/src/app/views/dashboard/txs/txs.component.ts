import { PaginationInfo } from '../../../pages/dashboard/txs/txs.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BroadcastTx200ResponseTxResponse } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  @Input()
  txs?: BroadcastTx200ResponseTxResponse[] | null;
  @Input()
  txTypeOptions?: string[] | null;
  @Input()
  selectedTxType?: string | null;

  @Output()
  selectedTxTypeChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  onSelectedTxTypeChanged(selectedTxType: string): void {
    this.selectedTxTypeChanged.emit(selectedTxType);
  }
}
