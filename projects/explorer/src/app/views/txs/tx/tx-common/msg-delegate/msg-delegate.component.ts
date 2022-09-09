import { txTitle } from './../../../../../models/cosmos/tx-common.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'view-msg-delegate',
  templateUrl: './msg-delegate.component.html',
  styleUrls: ['./msg-delegate.component.css'],
})
export class MsgDelegateComponent implements OnInit {
  @Input() txDetail?: txTitle | null;

  constructor() {}

  ngOnInit(): void {}
}
