import { Component, Input, OnInit } from '@angular/core';
import { BroadcastTx200ResponseTxResponse } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  @Input() txs?: BroadcastTx200ResponseTxResponse[] | null;

  constructor() {}

  ngOnInit(): void {}
}
