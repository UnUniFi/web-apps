import { ProposalContent } from '../proposals.component';
import { Component, Input, OnInit } from '@angular/core';
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

  voteDetailEnabled = false;

  constructor() {}

  jsonToSting(value: any) {
    if (typeof value === 'string') {
      return value;
    } else {
      return JSON.stringify(value);
    }
  }

  ngOnInit(): void {}
}
