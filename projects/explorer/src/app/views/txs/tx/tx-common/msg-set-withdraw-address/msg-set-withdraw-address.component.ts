import { Component, OnInit, Input } from '@angular/core';
import { txTitle, } from './../../../../../models/cosmos/tx-common.model';

@Component({
  selector: 'view-msg-set-withdraw-address',
  templateUrl: './msg-set-withdraw-address.component.html',
  styleUrls: ['./msg-set-withdraw-address.component.css']
})
export class MsgSetWithdrawAddressComponent implements OnInit {

  @Input() txDetail?: txTitle | null;

  constructor() { }

  ngOnInit(): void {
  }

}
