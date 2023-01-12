import { Component, Input, OnInit } from '@angular/core';
import { GetBlockByHeight200Response } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class BlocksComponent implements OnInit {
  @Input()
  //latestBlocks?: GetBlockByHeight200Response[] | null | undefined;
  latestBlocks?: bigint[] | null | undefined;

  constructor() {}

  ngOnInit(): void {}
}
