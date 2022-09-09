import { Component, OnInit, Input } from '@angular/core';
import { txTitle, } from './../../../../../models/cosmos/tx-common.model';

@Component({
  selector: 'view-msg-create-vesting-account',
  templateUrl: './msg-create-vesting-account.component.html',
  styleUrls: ['./msg-create-vesting-account.component.css']
})
export class MsgCreateVestingAccountComponent implements OnInit {

  @Input() txDetail?: txTitle | null;

  constructor() { }

  ngOnInit(): void {
  }

}
