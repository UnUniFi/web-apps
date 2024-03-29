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

  onPaginationChange(pageEvent: PageEvent): void {
    this.paginationChange.emit(pageEvent);
  }

  onCheckBoxAutoChange(checked: boolean) {
    this.checkBoxAutoChange.emit(checked);
  }
}
