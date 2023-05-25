import { txTitle } from '../../../models/cosmos/tx-common.model';
import { Component, Input, OnInit } from '@angular/core';
import { GetBlockByHeight200Response } from '@cosmos-client/core/esm/openapi';
import { CosmosTxV1beta1GetTxsEventResponse } from '@cosmos-client/core/esm/openapi/api';

@Component({
  selector: 'view-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css'],
})
export class BlockComponent implements OnInit {
  @Input()
  block?: GetBlockByHeight200Response | null;

  @Input()
  nextBlock?: number | null;

  @Input()
  previousBlock?: number | null;

  @Input()
  transactions?: CosmosTxV1beta1GetTxsEventResponse | null;

  @Input()
  txTitles?: txTitle[] | null;

  constructor() {}

  ngOnInit(): void {}
}
