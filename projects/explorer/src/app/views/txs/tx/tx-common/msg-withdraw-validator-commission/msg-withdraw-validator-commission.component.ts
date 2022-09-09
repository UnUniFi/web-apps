import { Component, OnInit, Input } from '@angular/core';
import { txTitle, } from './../../../../../models/cosmos/tx-common.model';

@Component({
  selector: 'view-msg-withdraw-validator-commission',
  templateUrl: './msg-withdraw-validator-commission.component.html',
  styleUrls: ['./msg-withdraw-validator-commission.component.css']
})
export class MsgWithdrawValidatorCommissionComponent implements OnInit {

  @Input() txDetail?: txTitle | null;

  constructor() { }

  ngOnInit(): void {
  }

}
