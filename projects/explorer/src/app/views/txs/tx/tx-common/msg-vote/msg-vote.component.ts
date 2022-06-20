import { Component, OnInit, Input } from '@angular/core';
import { txTitle, } from './../../../../../models/cosmos/tx-common.model';

@Component({
  selector: 'view-msg-vote',
  templateUrl: './msg-vote.component.html',
  styleUrls: ['./msg-vote.component.css']
})
export class MsgVoteComponent implements OnInit {

  @Input() txDetail?: txTitle | null;

  constructor() { }

  ngOnInit(): void {
  }

}
