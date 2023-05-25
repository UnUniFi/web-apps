import { ProposalContent } from '../proposals.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  Proposals200ResponseProposalsInner,
  Deposits200ResponseDepositsInner,
  Proposals200ResponseProposalsInnerFinalTallyResult,
  Votes200ResponseVotesInner,
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
  proposal?: Proposals200ResponseProposalsInner | null;
  @Input()
  proposalType?: string | null;
  @Input()
  deposits?: Deposits200ResponseDepositsInner[] | null;
  @Input()
  depositParams?: GovParams200ResponseDepositParams | null;
  @Input()
  tally?: Proposals200ResponseProposalsInnerFinalTallyResult | null;
  @Input()
  tallyParams?: GovParams200ResponseTallyParams | null;
  @Input()
  votes?: Votes200ResponseVotesInner[] | null;
  @Input()
  votingParams?: GovParams200ResponseVotingParams | null;
  @Input()
  proposalContent?: cosmosclient.proto.cosmos.gov.v1beta1.TextProposal | null;

  @Output()
  appClickVote: EventEmitter<number>;
  @Output()
  appClickDeposit: EventEmitter<number>;

  voteDetailEnabled = false;

  constructor() {
    this.appClickVote = new EventEmitter();
    this.appClickDeposit = new EventEmitter();
  }

  ngOnInit(): void {}

  unpackContent(value: any) {
    try {
      return cosmosclient.codec.protoJSONToInstance(value) as ProposalContent;
    } catch (error) {
      console.error(error);
      return value as ProposalContent;
    }
  }

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
