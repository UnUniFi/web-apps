import { Component, OnInit, Input } from '@angular/core';
import { txTitle, } from './../../../../../models/cosmos/tx-common.model';
import { proto, } from '@cosmos-client/core';

@Component({
  selector: 'view-msg-vote-weighted',
  templateUrl: './msg-vote-weighted.component.html',
  styleUrls: ['./msg-vote-weighted.component.css']
})
export class MsgVoteWeightedComponent implements OnInit {

  @Input() txDetail?: txTitle | null;

  options = proto.cosmos.gov.v1beta1.VoteOption

  constructor() { }

  ngOnInit(): void {
  }

}
