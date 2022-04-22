import { Component, Input, OnInit } from '@angular/core';
import { InlineResponse20036 } from '@cosmos-client/core/esm/openapi';
import { CosmosTxV1beta1GetTxsEventResponse } from '@cosmos-client/core/esm/openapi/api';

@Component({
  selector: 'view-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css'],
})
export class BlockComponent implements OnInit {
  @Input()
  block?: InlineResponse20036 | null;

  @Input()
  nextBlock?: number | null;

  @Input()
  previousBlock?: number | null;

  @Input()
  transactions?: CosmosTxV1beta1GetTxsEventResponse | null;

  @Input()
  txTypes?: string[] | null;

  constructor() {}

  ngOnInit(): void {}
}
