import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InlineResponse2004Cdp1 } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-debt-menu-dialog',
  templateUrl: './debt-menu-dialog.component.html',
  styleUrls: ['./debt-menu-dialog.component.css'],
})
export class DebtMenuDialogComponent implements OnInit {
  @Input()
  denom?: string | null;
  @Input()
  cdps?: (InlineResponse2004Cdp1 | undefined)[] | null;

  @Output()
  appCdp: EventEmitter<InlineResponse2004Cdp1>;
  @Output()
  appDetail: EventEmitter<string>;

  constructor() {
    this.appCdp = new EventEmitter();
    this.appDetail = new EventEmitter();
  }

  ngOnInit(): void {}

  onClickCdpButton(cdp: InlineResponse2004Cdp1) {
    if (!cdp) {
      return;
    }
    this.appCdp.emit(cdp);
  }

  onClickDetailButton() {
    if (!this.denom) {
      return;
    }
    this.appDetail.emit(this.denom);
  }
}
