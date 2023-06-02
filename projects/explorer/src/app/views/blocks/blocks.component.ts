import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { GetLatestBlock200Response } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class BlocksComponent implements OnInit {
  @Input()
  blocks?: GetLatestBlock200Response[] | null;

  @Input()
  pageSizeOptions?: number[] | null;

  @Input()
  pageSize?: number | null;

  @Input()
  pageNumber?: number | null;

  @Input()
  pageLength?: number | null;

  @Output()
  paginationChange: EventEmitter<PageEvent>;

  @Output()
  checkBoxAutoChange: EventEmitter<boolean>;

  constructor() {
    this.paginationChange = new EventEmitter();
    this.checkBoxAutoChange = new EventEmitter();
  }

  ngOnInit(): void {}

  onPaginationChange($event?: number): void {
    if (!this.pageNumber || !this.pageSize || !this.pageLength) {
      return;
    }
    if ($event == 1) {
      this.pageNumber -= 1;
    } else if ($event == 2) {
      this.pageNumber += 1;
    }
    if (this.pageNumber < 1) {
      alert('This is the first page!');
      this.pageNumber = 1;
      return;
    }
    this.paginationChange.emit({
      pageIndex: this.pageNumber - 1,
      pageSize: this.pageSize,
      length: this.pageLength,
    });
  }

  calcItemsIndex(): { start: number; end: number } {
    if (!this.pageNumber || !this.pageSize) {
      return { start: 0, end: 0 };
    } else {
      const start = (this.pageNumber - 1) * this.pageSize + 1;
      const end = this.pageNumber * this.pageSize;
      return { start, end };
    }
  }

  onCheckBoxAutoChange(checked: boolean) {
    this.checkBoxAutoChange.emit(checked);
  }
}
