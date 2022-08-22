import { txParseProposalContent } from './../../../../../../../explorer/src/app/utils/tx-parser';
import { CosmosRestService } from './../../../../models/cosmos-rest.service';
import { Injectable } from '@angular/core';
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
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProposalUseCaseService {
  constructor(private readonly cosmosRest: CosmosRestService) {}

  proposal$(proposalID$: Observable<string>): Observable<InlineResponse20027Proposals | undefined> {
    console.log('cosmosRest', this.cosmosRest);
    return proposalID$.pipe(mergeMap((id) => this.cosmosRest.getProposal$(id)));
  }
  proposalType$(
    proposal$: Observable<InlineResponse20027Proposals | undefined>,
  ): Observable<string | undefined> {
    return proposal$.pipe(
      map((proposal) => {
        if (proposal && proposal.content) {
          return (proposal.content as any)['@type'];
        }
      }),
    );
  }
  proposalContent$(
    proposal$: Observable<InlineResponse20027Proposals | undefined>,
  ): Observable<cosmosclient.proto.cosmos.gov.v1beta1.TextProposal | undefined> {
    return proposal$.pipe(map((proposal) => txParseProposalContent(proposal?.content!)));
  }
  deposits$(
    proposalID$: Observable<string>,
  ): Observable<InlineResponse20029Deposits[] | undefined> {
    return proposalID$.pipe(mergeMap((id) => this.cosmosRest.getDeposits$(id)));
  }
  get depositsParams$(): Observable<InlineResponse20026DepositParams | undefined> {
    return this.cosmosRest.getDepositParams$();
  }
  tally$(
    proposalID$: Observable<string>,
  ): Observable<InlineResponse20027FinalTallyResult | undefined> {
    return proposalID$.pipe(mergeMap((proposalId) => this.cosmosRest.getTallyResult$(proposalId)));
  }
  get tallyParams$(): Observable<InlineResponse20026TallyParams | undefined> {
    return this.cosmosRest.getTallyParams$();
  }
  votes$(proposalID$: Observable<string>): Observable<InlineResponse20032Votes[] | undefined> {
    return proposalID$.pipe(mergeMap((proposalId) => this.cosmosRest.getVotes$(proposalId)));
  }
  get votingParams$(): Observable<InlineResponse20026VotingParams | undefined> {
    return this.cosmosRest.getVotingParams$();
  }
}
