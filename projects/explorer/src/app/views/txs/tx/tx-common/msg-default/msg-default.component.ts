import { txTitle } from '../../../../../models/cosmos/tx-common.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'view-msg-default',
  templateUrl: './msg-default.component.html',
  styleUrls: ['./msg-default.component.css'],
})
export class MsgDefaultComponent implements OnInit {
  @Input() txDetail?: txTitle | null;

  constructor() {}

  ngOnInit(): void {}
}
