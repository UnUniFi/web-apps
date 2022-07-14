import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import cosmosclient from '@cosmos-client/core';
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

  @Input() proposals?: InlineResponse20027Proposals[] | null;
  @Input() tallies?: (InlineResponse20027FinalTallyResult | undefined)[] | null;
  @Input() proposalContents?: (cosmosclient.proto.cosmos.gov.v1beta1.TextProposal | undefined)[] | null;
  @Input() pageSizeOptions?: number[] | null;
  @Input() pageSize?: number | null;
  @Input() pageNumber?: number | null;
  @Input() pageLength?: number | null;
  @Output() paginationChange: EventEmitter<PageEvent>;
  @Output() appClickVote: EventEmitter<number>;

  constructor() {
    this.paginationChange = new EventEmitter();
    this.appClickVote = new EventEmitter();
  }

  ngOnInit(): void { }

  /*
  unpackContent(value: any) {
    try {
      return cosmosclient.codec.protoJSONToInstance(value) as ProposalContent;
    } catch {
      return null;
    }
  }
  */

  onPaginationChange(pageEvent: PageEvent): void {
    this.paginationChange.emit(pageEvent);
  }

  onClickVote(proposalID: string) {
    this.appClickVote.emit(Number(proposalID));
  }
}
