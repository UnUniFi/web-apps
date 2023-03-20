import { Component, Input, OnInit } from '@angular/core';
import {
  Proposals200ResponseProposalsInner,
  Deposits200ResponseDepositsInner,
  Proposals200ResponseProposalsInnerFinalTallyResult,
  Votes200ResponseVotesInner,
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
  deposits?: Deposits200ResponseDepositsInner[] | null;
  @Input()
  tally?: Proposals200ResponseProposalsInnerFinalTallyResult | null;
  @Input()
  votes?: Votes200ResponseVotesInner[] | null;

  constructor() {}

  ngOnInit(): void {}
}
