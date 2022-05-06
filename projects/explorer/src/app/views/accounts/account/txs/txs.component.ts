import { PaginationInfo } from '../../../../pages/accounts/account/txs/txs.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CosmosTxV1beta1GetTxsEventResponse } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  @Input() txsWithPagination?: CosmosTxV1beta1GetTxsEventResponse | null;

  @Input() pageSizeOptions?: number[] | null;

  @Input() pageInfo?: PaginationInfo | null;

  @Input() pageLength?: number | null;

  @Output() paginationChange: EventEmitter<PageEvent>;

  constructor() {
    this.paginationChange = new EventEmitter();
  }

  ngOnInit(): void {}

  onPaginationChange(pageEvent: PageEvent): void {
    this.paginationChange.emit(pageEvent);
  }
}
