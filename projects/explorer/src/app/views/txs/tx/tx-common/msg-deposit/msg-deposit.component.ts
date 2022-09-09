import { txTitle } from './../../../../../models/cosmos/tx-common.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'view-msg-deposit',
  templateUrl: './msg-deposit.component.html',
  styleUrls: ['./msg-deposit.component.css'],
})
export class MsgDepositComponent implements OnInit {
  @Input() txDetail?: txTitle | null;

  constructor() {}

  ngOnInit(): void {}
}
