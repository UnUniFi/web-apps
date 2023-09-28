import { txTitle } from '../../../../../models/cosmos/tx-common.model';
import { Component, OnInit, Input } from '@angular/core';
import { CosmosTxV1beta1GetTxResponse } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-msg-default',
  templateUrl: './msg-default.component.html',
  styleUrls: ['./msg-default.component.css'],
})
export class MsgDefaultComponent implements OnInit {
  @Input() tx?: CosmosTxV1beta1GetTxResponse | null;
  @Input() txDetail?: txTitle | null;

  constructor() {}

  ngOnInit(): void {}
}
