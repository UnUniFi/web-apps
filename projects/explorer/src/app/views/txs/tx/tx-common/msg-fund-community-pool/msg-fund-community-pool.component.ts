import { Component, OnInit, Input } from '@angular/core';
import { txTitle, } from './../../../../../models/cosmos/tx-common.model';

@Component({
  selector: 'view-msg-fund-community-pool',
  templateUrl: './msg-fund-community-pool.component.html',
  styleUrls: ['./msg-fund-community-pool.component.css']
})
export class MsgFundCommunityPoolComponent implements OnInit {

  @Input() txDetail?: txTitle | null;

  constructor() { }

  ngOnInit(): void {
  }

}
