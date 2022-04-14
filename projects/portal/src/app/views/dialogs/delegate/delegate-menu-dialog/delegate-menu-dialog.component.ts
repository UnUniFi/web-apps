import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InlineResponse20066Validators } from '@cosmos-client/core/esm/openapi/api';
import * as crypto from 'crypto';

@Component({
  selector: 'view-delegate-menu-dialog',
  templateUrl: './delegate-menu-dialog.component.html',
  styleUrls: ['./delegate-menu-dialog.component.css'],
})
export class DelegateMenuDialogComponent implements OnInit {
  @Input()
  selectedValidator?: InlineResponse20066Validators | null;

  @Output()
  appDelegate: EventEmitter<InlineResponse20066Validators>;

  @Output()
  appDetail: EventEmitter<InlineResponse20066Validators>;

  constructor() {
    this.appDelegate = new EventEmitter();
    this.appDetail = new EventEmitter();
  }

  ngOnInit(): void {}

  getColorCode(address: string) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(address ?? ''))
      .digest()
      .toString('hex');
    return `#${hash.substr(0, 6)}`;
  }

  onClickDelegateButton() {
    if (!this.selectedValidator) {
      return;
    }
    this.appDelegate.emit(this.selectedValidator);
  }

  onClickDetailButton() {
    if (!this.selectedValidator) {
      return;
    }
    this.appDetail.emit(this.selectedValidator);
  }
}
