import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  InlineResponse20027Proposals,
  InlineResponse20029Deposits,
  InlineResponse20027FinalTallyResult,
  InlineResponse20032Votes,
  InlineResponse20026DepositParams,
  InlineResponse20026TallyParams,
  InlineResponse20026VotingParams,
} from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css'],
})
export class ProposalComponent implements OnInit {
  @Input()
  proposal?: InlineResponse20027Proposals | null;
  @Input()
  proposalType?: string | null;
  @Input()
  deposits?: InlineResponse20029Deposits[] | null;
  @Input()
  depositParams?: InlineResponse20026DepositParams | null;
  @Input()
  tally?: InlineResponse20027FinalTallyResult | null;
  @Input()
  tallyParams?: InlineResponse20026TallyParams | null;
  @Input()
  votes?: InlineResponse20032Votes[] | null;
  @Input()
  votingParams?: InlineResponse20026VotingParams | null;
  @Input()
  proposalContent?: cosmosclient.proto.cosmos.gov.v1beta1.TextProposal | null;

  @Output()
  appClickVote: EventEmitter<number>;
  @Output()
  appClickDeposit: EventEmitter<number>;

  constructor() {
    this.appClickVote = new EventEmitter();
    this.appClickDeposit = new EventEmitter();
  }

  ngOnInit(): void { }

  toNumber(str: string) {
    return Number(str);
  }

  onClickVote(proposalID: string) {
    this.appClickVote.emit(Number(proposalID));
  }

  onClickDeposit(proposalID: string) {
    this.appClickDeposit.emit(Number(proposalID));
  }
}
