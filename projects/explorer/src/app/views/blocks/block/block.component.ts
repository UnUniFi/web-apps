import { Component, Input, OnInit } from '@angular/core';
import { InlineResponse20036 } from '@cosmos-client/core/esm/openapi';

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

  @Input() //Todo: fix real txs
  transactions?: number[];

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      console.log('block', this.block);
    }, 5000);
  }
}
