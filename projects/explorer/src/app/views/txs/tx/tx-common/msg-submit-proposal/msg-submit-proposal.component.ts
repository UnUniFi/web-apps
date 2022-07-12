import { Component, OnInit, Input } from '@angular/core';
import { txTitle, } from './../../../../../models/cosmos/tx-common.model';

@Component({
  selector: 'view-msg-submit-proposal',
  templateUrl: './msg-submit-proposal.component.html',
  styleUrls: ['./msg-submit-proposal.component.css']
})
export class MsgSubmitProposalComponent implements OnInit {

  @Input() txDetail?: txTitle | null;

  constructor() { }

  ngOnInit(): void {
  }

}
