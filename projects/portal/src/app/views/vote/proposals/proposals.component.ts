import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cosmosclient } from '@cosmos-client/core';
import {
  InlineResponse20052FinalTallyResult,
  InlineResponse20052Proposals,
} from '@cosmos-client/core/esm/openapi';

export interface ProposalContent {
  type: string;
  title: string;
  description: string;
}

@Component({
  selector: 'view-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css'],
})
export class ProposalsComponent implements OnInit {
  @Input()
  proposals?: InlineResponse20052Proposals[] | null;

  @Input()
  tallies?: (InlineResponse20052FinalTallyResult | undefined)[] | null;

  @Output()
  appClickVote: EventEmitter<number>;

  constructor() {
    this.appClickVote = new EventEmitter();
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

  onClickVote(proposalID: string) {
    this.appClickVote.emit(Number(proposalID));
  }
}
