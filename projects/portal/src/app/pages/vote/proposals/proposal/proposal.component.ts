import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import {
  InlineResponse20026DepositParams,
  InlineResponse20026TallyParams,
  InlineResponse20026VotingParams,
  InlineResponse20027FinalTallyResult,
  InlineResponse20027Proposals,
  InlineResponse20029Deposits,
  InlineResponse20032Votes,
} from '@cosmos-client/core/esm/openapi';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { GovApplicationService } from 'projects/portal/src/app/models/cosmos/gov.application.service';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { txParseProposalContent } from 'projects/explorer/src/app/utils/tx-parser';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css'],
})
export class ProposalComponent implements OnInit {
  proposal$: Observable<InlineResponse20027Proposals | undefined>;
  proposalType$: Observable<string | undefined>;
  proposalContent$: Observable<cosmosclient.proto.cosmos.gov.v1beta1.TextProposal | undefined>;
  deposits$: Observable<InlineResponse20029Deposits[] | undefined>;
  depositParams$: Observable<InlineResponse20026DepositParams | undefined>;
  tally$: Observable<InlineResponse20027FinalTallyResult | undefined>;
  tallyParams$: Observable<InlineResponse20026TallyParams | undefined>;
  votes$: Observable<InlineResponse20032Votes[] | undefined>;
  votingParams$: Observable<InlineResponse20026VotingParams | undefined>;

  constructor(
    private route: ActivatedRoute,
    private readonly govAppService: GovApplicationService,
    private readonly cosmosRest: CosmosRestService,
  ) {
    const proposalID$ = this.route.params.pipe(map((params) => params.id as string));

    this.proposal$ = proposalID$.pipe(mergeMap((id) => this.cosmosRest.getProposal$(id)));

    this.proposalType$ = this.proposal$.pipe(
      map((proposal) => {
        if (proposal && proposal.content) {
          return (proposal.content as any)['@type'];
        }
      }),
    );

    this.deposits$ = proposalID$.pipe(mergeMap((id) => this.cosmosRest.getDeposits$(id)));
    this.depositParams$ = this.cosmosRest.getDepositParams$();

    this.tally$ = proposalID$.pipe(
      mergeMap((proposalId) => this.cosmosRest.getTallyResult$(proposalId)),
    );
    this.proposalContent$ = this.proposal$.pipe(
      map((proposal) => txParseProposalContent(proposal?.content!))
    );
    this.tallyParams$ = this.cosmosRest.getTallyParams$();

    this.votes$ = proposalID$.pipe(mergeMap((proposalId) => this.cosmosRest.getVotes$(proposalId)));
    this.votingParams$ = this.cosmosRest.getVotingParams$();
  }

  ngOnInit(): void { }

  onVoteProposal(proposalID: number) {
    this.govAppService.openVoteFormDialog(proposalID);
  }

  onDepositProposal(proposalID: number) {
    this.govAppService.openDepositFormDialog(proposalID);
  }
}
