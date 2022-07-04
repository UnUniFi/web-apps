import { CosmosRestService } from './../../../../models/cosmos-rest.service';
import { Injectable } from '@angular/core';
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

@Injectable({ providedIn: 'root' })
export class ProposalUsecaseService {
  constructor(private cosmosRest: CosmosRestService) {}

  get depositsParams$(): Observable<InlineResponse20026DepositParams | undefined> {
    return this.cosmosRest.getDepositParams$();
  }

  get tallyParams$(): Observable<InlineResponse20026TallyParams | undefined> {
    return this.cosmosRest.getTallyParams$();
  }

  get votingParams$(): Observable<InlineResponse20026VotingParams | undefined> {
    return this.cosmosRest.getVoteParams$();
  }

  proposal$(proposalId: string): Observable<InlineResponse20027Proposals | undefined> {
    return this.cosmosRest.getProposal$(proposalId);
  }

  deposits$(proposalId: string): Observable<InlineResponse20029Deposits[] | undefined> {
    return this.cosmosRest.getDeposits$(proposalId);
  }

  tally$(proposalId: string): Observable<InlineResponse20027FinalTallyResult | undefined> {
    return this.cosmosRest.getTally$(proposalId);
  }

  votes$(proposalId: string): Observable<InlineResponse20032Votes[] | undefined> {
    return this.cosmosRest.getVote$(proposalId);
  }
}
