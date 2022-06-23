import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cosmosclient } from '@cosmos-client/core';
import {
  InlineResponse20027FinalTallyResult,
  InlineResponse20027Proposals,
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
  proposals?: InlineResponse20027Proposals[] | null;

  @Input()
  tallies?: (InlineResponse20027FinalTallyResult | undefined)[] | null;

  @Output()
  appClickVote: EventEmitter<number>;

  constructor() {
    this.appClickVote = new EventEmitter();
  }

  ngOnInit(): void {}

  unpackContent(value: any) {
    try {
      return cosmosclient.codec.protoJSONToInstance(value) as ProposalContent;
    } catch {
      return null;
    }
  }

  onClickVote(proposalID: string) {
    this.appClickVote.emit(Number(proposalID));
  }
}
