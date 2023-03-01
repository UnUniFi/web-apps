import { Component, Input, OnInit } from '@angular/core';
import {
  InlineResponse20027Proposals,
  InlineResponse20029Deposits,
  InlineResponse20027FinalTallyResult,
  InlineResponse20032Votes,
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
  deposits?: InlineResponse20029Deposits[] | null;
  @Input()
  tally?: InlineResponse20027FinalTallyResult | null;
  @Input()
  votes?: InlineResponse20032Votes[] | null;

  constructor() {}

  ngOnInit(): void {}
}
