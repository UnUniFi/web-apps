import { PaginationInfo } from '../../pages/txs/txs.component';
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
  txTypeOptions: string[];
  @Input()
  selectedTxType?: string | null;

  @Input()
  pageSizeOptions?: number[] | null;

  @Input()
  pageInfo?: PaginationInfo | null;

  @Input()
  pageLength?: number | null;

  @Output()
  selectedTxTypeChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  paginationChange: EventEmitter<PageEvent>;

  constructor() {
    this.paginationChange = new EventEmitter();
    this.txTypeOptions = ['bank', 'distribution', 'gov', 'ibc', 'staking'];
  }

  ngOnInit(): void {}

  onSelectedTxTypeChanged(selectedTxType: string): void {
    this.selectedTxTypeChanged.emit(selectedTxType);
  }

  onPaginationChange($event?: number): void {
    if (!this.pageInfo || !this.pageLength) {
      return;
    }
    if ($event == 1) {
      this.pageInfo.pageNumber -= 1;
    } else if ($event == 2) {
      this.pageInfo.pageNumber += 1;
      if (this.pageInfo.pageNumber * this.pageInfo.pageSize > 100) {
        alert('Currently limited to displaying the 100 latest entries');
        this.pageInfo.pageNumber -= 1;
        return;
      }
    }
    if (this.pageInfo.pageNumber < 1) {
      alert('This is the first page!');
      this.pageInfo.pageNumber = 1;
      return;
    }

    this.paginationChange.emit({
      pageIndex: this.pageInfo.pageNumber - 1,
      pageSize: this.pageInfo.pageSize,
      length: this.pageLength,
    });
  }

  calcItemsIndex(): { start: number; end: number } {
    if (!this.pageInfo) {
      return { start: 0, end: 0 };
    } else {
      const start = (this.pageInfo.pageNumber - 1) * this.pageInfo.pageSize + 1;
      const end = this.pageInfo.pageNumber * this.pageInfo.pageSize;
      return { start, end };
    }
  }
}
