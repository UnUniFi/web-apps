import { txTitle } from './../../../../models/cosmos/tx-common.model';
import { Component, OnInit, Input } from '@angular/core';
import { CosmosTxV1beta1GetTxResponse } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'app-tx-messages',
  templateUrl: './tx-messages.component.html',
  styleUrls: ['./tx-messages.component.css'],
})
export class TxMessagesComponent implements OnInit {
  @Input() tx?: CosmosTxV1beta1GetTxResponse | null;

  @Input() txDetails?: txTitle[] | null;

  @Input() txTypes?: string[];

  constructor() {}

  ngOnInit(): void {}
}
