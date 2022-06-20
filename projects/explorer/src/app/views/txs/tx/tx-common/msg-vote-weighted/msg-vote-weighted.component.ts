import { Component, OnInit, Input } from '@angular/core';
import { txTitle, } from './../../../../../models/cosmos/tx-common.model';

@Component({
  selector: 'view-msg-vote-weighted',
  templateUrl: './msg-vote-weighted.component.html',
  styleUrls: ['./msg-vote-weighted.component.css']
})
export class MsgVoteWeightedComponent implements OnInit {

  @Input() txDetail?: txTitle | null;

  constructor() { }

  ngOnInit(): void {
  }

}
