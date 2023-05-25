import { Component, OnInit, Input } from '@angular/core';
import { txTitle, } from './../../../../../models/cosmos/tx-common.model';

@Component({
  selector: 'view-msg-begin-redelegate',
  templateUrl: './msg-begin-redelegate.component.html',
  styleUrls: ['./msg-begin-redelegate.component.css']
})
export class MsgBeginRedelegateComponent implements OnInit {

  @Input() txDetail?: txTitle | null;

  constructor() { }

  ngOnInit(): void {
  }

}
