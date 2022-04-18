import { ProposalContent } from '../proposals.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cosmosclient } from '@cosmos-client/core';
import {
  InlineResponse20052Proposals,
  InlineResponse20054Deposits,
  InlineResponse20052FinalTallyResult,
  InlineResponse20057Votes,
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
  tally?: InlineResponse20052FinalTallyResult | null;
  @Input()
  votes?: InlineResponse20057Votes[] | null;

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
      return cosmosclient.codec.unpackCosmosAny(value) as ProposalContent;
    } catch {
      return null;
    }
  }

  onClickVote(proposalID: string) {
    this.appClickVote.emit(Number(proposalID));
  }

  onClickDeposit(proposalID: string) {
    this.appClickDeposit.emit(Number(proposalID));
  }
}
