import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import cosmosclient from '@cosmos-client/core';
import {
  GovV1Proposal200ResponseProposalsInnerFinalTallyResult,
  GovV1Proposal200ResponseProposalsInner,
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
  @Input() proposals?: GovV1Proposal200ResponseProposalsInner[] | null;
  @Input() tallies?:
    | { yes: number; no: number; abstain: number; noWithVeto: number; max: number }[]
    | null;
  @Input() proposalContents?:
    | (cosmosclient.proto.cosmos.gov.v1beta1.TextProposal | undefined)[]
    | null;
  @Input() pageSizeOptions?: number[] | null;
  @Input() pageSize?: number | null;
  @Input() pageNumber?: number | null;
  @Input() pageLength?: number | null;
  @Output() paginationChange: EventEmitter<PageEvent>;

  constructor() {
    this.paginationChange = new EventEmitter();
  }

  ngOnInit(): void {}

  getProposalTitle(proposal: GovV1Proposal200ResponseProposalsInner): string {
    if (proposal.content) {
      return (proposal.content as any).title;
    } else {
      return '';
    }
  }

  onPaginationChange($event?: number): void {
    if (!this.pageNumber || !this.pageSize || !this.pageLength) {
      return;
    }
    if ($event == 1) {
      this.pageNumber -= 1;
    } else if ($event == 2) {
      this.pageNumber += 1;
    }
    if (this.pageNumber < 1) {
      alert('This is the first page!');
      this.pageNumber = 1;
      return;
    }
    this.paginationChange.emit({
      pageIndex: this.pageNumber - 1,
      pageSize: this.pageSize,
      length: this.pageLength,
    });
  }

  calcItemsIndex(): { start: number; end: number } {
    if (!this.pageNumber || !this.pageSize) {
      return { start: 0, end: 0 };
    } else {
      const start = (this.pageNumber - 1) * this.pageSize + 1;
      const end = this.pageNumber * this.pageSize;
      return { start, end };
    }
  }
}
