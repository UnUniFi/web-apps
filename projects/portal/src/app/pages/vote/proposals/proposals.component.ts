import { CosmosRestService } from '../../../models/cosmos-rest.service';
import { GovApplicationService } from '../../../models/cosmos/gov.application.service';
import { Component, OnInit } from '@angular/core';
import {
  InlineResponse20027FinalTallyResult,
  InlineResponse20027Proposals,
} from '@cosmos-client/core/esm/openapi/api';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

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
    private readonly cosmosRest: CosmosRestService,
  ) {
    this.proposals$ = this.cosmosRest.getProposals$().pipe(map((res) => res!));
    this.tallies$ = this.proposals$.pipe(
      mergeMap((proposals) =>
        combineLatest(
          proposals.map((proposal) => this.cosmosRest.getTallyResult$(proposal.proposal_id!)),
        ),
      ),
    );
  }

  ngOnInit(): void {}

  onVoteProposal(proposalID: number) {
    this.govAppService.openVoteFormDialog(proposalID);
  }
}
