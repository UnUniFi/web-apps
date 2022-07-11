import { CosmosRestService } from '../../../models/cosmos-rest.service';
import { GovApplicationService } from '../../../models/cosmos/gov.application.service';
import { Component, OnInit } from '@angular/core';
import {
  InlineResponse20027FinalTallyResult,
  InlineResponse20027Proposals,
} from '@cosmos-client/core/esm/openapi/api';
import cosmosclient from '@cosmos-client/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { txParseProposalContent } from 'projects/explorer/src/app/utils/tx-parser';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css'],
})
export class ProposalsComponent implements OnInit {
  proposals$: Observable<InlineResponse20027Proposals[]>;
  proposalContents$: Observable<(cosmosclient.proto.cosmos.gov.v1beta1.TextProposal | undefined)[]>;
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
    this.proposalContents$ = this.proposals$.pipe(
      mergeMap((proposals) =>
        combineLatest(
          proposals.map((proposal) => of(txParseProposalContent(proposal.content!)))
        ),
      ),
    );
  }

  ngOnInit(): void { }

  onVoteProposal(proposalID: number) {
    this.govAppService.openVoteFormDialog(proposalID);
  }
}
