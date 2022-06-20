import { ProposalContent } from '../proposals.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cosmosclient } from '@cosmos-client/core';
import {
  InlineResponse20052Proposals,
  InlineResponse20054Deposits,
  InlineResponse20052FinalTallyResult,
  InlineResponse20057Votes,
  InlineResponse20051DepositParams,
  InlineResponse20051TallyParams,
  InlineResponse20051VotingParams,
} from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css'],
})
export class ProposalComponent implements OnInit {
  @Input()
  proposal?: InlineResponse20052Proposals | null;
  @Input()
  proposalType?: string | null;
  @Input()
  deposits?: InlineResponse20054Deposits[] | null;
  @Input()
  depositParams?: InlineResponse20051DepositParams | null;
  @Input()
  tally?: InlineResponse20052FinalTallyResult | null;
  @Input()
  tallyParams?: InlineResponse20051TallyParams | null;
  @Input()
  votes?: InlineResponse20057Votes[] | null;
  @Input()
  votingParams?: InlineResponse20051VotingParams | null;

  @Output()
  appClickVote: EventEmitter<number>;
  @Output()
  appClickDeposit: EventEmitter<number>;

  constructor() {
    this.appClickVote = new EventEmitter();
    this.appClickDeposit = new EventEmitter();
  }

  ngOnInit(): void {}

  unpackContent(value: any) {
    try {
      return cosmosclient.codec.protoJSONToInstance(value) as ProposalContent;
    } catch {
      return null;
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
