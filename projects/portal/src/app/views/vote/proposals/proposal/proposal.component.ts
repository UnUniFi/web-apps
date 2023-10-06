import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  GovV1Proposal200ResponseProposalsInner,
  Deposits200ResponseDepositsInner,
  GovV1Proposal200ResponseProposalsInnerFinalTallyResult,
  GovV1Votes200ResponseVotesInner,
  GovParams200ResponseDepositParams,
  GovParams200ResponseTallyParams,
  GovParams200ResponseVotingParams,
} from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css'],
})
export class ProposalComponent implements OnInit {
  @Input()
  proposal?: GovV1Proposal200ResponseProposalsInner | null;
  @Input()
  deposits?: Deposits200ResponseDepositsInner[] | null;
  @Input()
  depositParams?: GovParams200ResponseDepositParams | null;
  @Input()
  tally?: GovV1Proposal200ResponseProposalsInnerFinalTallyResult | null;
  @Input()
  tallyParams?: GovParams200ResponseTallyParams | null;
  @Input()
  votes?: GovV1Votes200ResponseVotesInner[] | null;
  @Input()
  votingParams?: GovParams200ResponseVotingParams | null;
  @Input()
  tallyTotalCount?: number | null;
  @Input()
  quorum?: number | null;
  @Input()
  threshold?: number | null;
  @Input()
  vetoThreshold?: number | null;

  @Output()
  appClickVote: EventEmitter<number>;
  @Output()
  appClickDeposit: EventEmitter<number>;

  voteDetailEnabled = false;
  depositDetailEnabled = false;
  quorumNotReached = false;
  thresholdNotReached = false;
  vetoThresholdReached = false;

  constructor() {
    this.appClickVote = new EventEmitter();
    this.appClickDeposit = new EventEmitter();
  }

  ngOnInit(): void {}

  calcTallyRatio(tallyCount?: string) {
    if (!this.tallyTotalCount) {
      return 0;
    }
    return Number(tallyCount) / this.tallyTotalCount;
  }

  onClickVote(proposalID: string) {
    this.appClickVote.emit(Number(proposalID));
  }

  onClickDeposit(proposalID: string) {
    this.appClickDeposit.emit(Number(proposalID));
  }
}
