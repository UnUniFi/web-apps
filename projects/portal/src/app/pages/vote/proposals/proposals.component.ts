import { GovApplicationService } from '../../../models/cosmos/gov.application.service';
import { ProposalsUsecaseService } from './proposals.usecase.service';
import { Component, OnInit } from '@angular/core';
import {
  InlineResponse20027FinalTallyResult,
  InlineResponse20027Proposals,
} from '@cosmos-client/core/esm/openapi/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css'],
})
export class ProposalsComponent implements OnInit {
  proposals$: Observable<InlineResponse20027Proposals[]>;
  tallies$: Observable<(InlineResponse20027FinalTallyResult | undefined)[]>;

  constructor(
    private readonly govAppService: GovApplicationService,
    private readonly usecase: ProposalsUsecaseService,
  ) {
    this.proposals$ = this.usecase.proposals$;
    this.tallies$ = this.usecase.tallies$;
  }

  ngOnInit(): void {}

  onVoteProposal(proposalID: number) {
    this.govAppService.openVoteFormDialog(proposalID);
  }
}
