import { txParseProposalContent } from './../../../../../../../explorer/src/app/utils/tx-parser';
import { CosmosRestService } from './../../../../models/cosmos-rest.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  Deposits200ResponseDepositsInner,
  GovParams200ResponseDepositParams,
  GovParams200ResponseTallyParams,
  GovParams200ResponseVotingParams,
  GovV1Proposal200ResponseProposalsInner,
  GovV1Proposal200ResponseProposalsInnerFinalTallyResult,
  GovV1Votes200ResponseVotesInner,
} from '@cosmos-client/core/esm/openapi';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProposalUseCaseService {
  constructor(private readonly cosmosRest: CosmosRestService) {}

  proposal$(
    proposalID$: Observable<string>,
  ): Observable<GovV1Proposal200ResponseProposalsInner | undefined> {
    return proposalID$.pipe(mergeMap((id) => this.cosmosRest.getProposal$(id)));
  }
  deposits$(
    proposalID$: Observable<string>,
  ): Observable<Deposits200ResponseDepositsInner[] | undefined> {
    return proposalID$.pipe(mergeMap((id) => this.cosmosRest.getDeposits$(id)));
  }
  get depositsParams$(): Observable<GovParams200ResponseDepositParams | undefined> {
    return this.cosmosRest.getDepositParams$();
  }
  tally$(
    proposalID$: Observable<string>,
  ): Observable<GovV1Proposal200ResponseProposalsInnerFinalTallyResult | undefined> {
    return proposalID$.pipe(mergeMap((proposalId) => this.cosmosRest.getTallyResult$(proposalId)));
  }
  get tallyParams$(): Observable<GovParams200ResponseTallyParams | undefined> {
    return this.cosmosRest.getTallyParams$();
  }
  votes$(
    proposalID$: Observable<string>,
  ): Observable<GovV1Votes200ResponseVotesInner[] | undefined> {
    return proposalID$.pipe(mergeMap((proposalId) => this.cosmosRest.getVotes$(proposalId)));
  }
  get votingParams$(): Observable<GovParams200ResponseVotingParams | undefined> {
    return this.cosmosRest.getVotingParams$();
  }
}
