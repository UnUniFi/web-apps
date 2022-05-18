import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { InlineResponse2004Cdp1 } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-cdp-menu-dialog',
  templateUrl: './cdp-menu-dialog.component.html',
  styleUrls: ['./cdp-menu-dialog.component.css'],
})
export class CdpMenuDialogComponent implements OnInit {
  @Input()
  cdp?: InlineResponse2004Cdp1 | null;
  @Output()
  appDetail: EventEmitter<InlineResponse2004Cdp1>;
  @Output()
  appDeposit: EventEmitter<InlineResponse2004Cdp1>;
  @Output()
  appClear: EventEmitter<InlineResponse2004Cdp1>;
  @Output()
  appWithdraw: EventEmitter<InlineResponse2004Cdp1>;
  @Output()
  appIssue: EventEmitter<InlineResponse2004Cdp1>;

  constructor() {
    this.appDetail = new EventEmitter();
    this.appDeposit = new EventEmitter();
    this.appClear = new EventEmitter();
    this.appWithdraw = new EventEmitter();
    this.appIssue = new EventEmitter();
  }

  ngOnInit(): void {}

  onClickDetailButton() {
    if (!this.cdp) {
      return;
    }
    this.appDetail.emit(this.cdp);
  }

  onClickDepositButton() {
    if (!this.cdp) {
      return;
    }
    this.appDeposit.emit(this.cdp);
  }

  onClickClearButton() {
    if (!this.cdp) {
      return;
    }
    this.appClear.emit(this.cdp);
  }

  onClickWithdrawButton() {
    if (!this.cdp) {
      return;
    }
    this.appWithdraw.emit(this.cdp);
  }

  onClickIssueButton() {
    if (!this.cdp) {
      return;
    }
    this.appIssue.emit(this.cdp);
  }
}
