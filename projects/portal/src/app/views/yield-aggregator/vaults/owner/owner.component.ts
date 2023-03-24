import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TransferVaultRequest } from 'projects/portal/src/app/models/ununifi/yield-aggregator.model';

@Component({
  selector: 'view-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css'],
})
export class OwnerComponent implements OnInit {
  @Output()
  appDelete: EventEmitter<string>;
  @Output()
  appTransfer: EventEmitter<TransferVaultRequest>;

  constructor() {
    this.appDelete = new EventEmitter();
    this.appTransfer = new EventEmitter();
  }

  ngOnInit(): void {}
}
