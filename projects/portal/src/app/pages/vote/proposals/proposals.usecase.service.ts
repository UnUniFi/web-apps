import { CosmosRestService } from '../../../models/cosmos-rest.service';
import { Injectable } from '@angular/core';
import {
  InlineResponse20027FinalTallyResult,
  InlineResponse20027Proposals,
} from '@cosmos-client/core/esm/openapi';
import { combineLatest, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProposalsUsecaseService {
  constructor(private readonly cosmosRest: CosmosRestService) {}

  get proposals$(): Observable<InlineResponse20027Proposals[]> {
    return this.cosmosRest.getProposals$();
  }

  get tallies$(): Observable<(InlineResponse20027FinalTallyResult | undefined)[]> {
    return this.cosmosRest
      .getProposals$()
      .pipe(
        mergeMap((proposals) =>
          combineLatest(
            proposals.map((proposal) => this.cosmosRest.getTally$(proposal.proposal_id!)),
          ),
        ),
      );
  }
}
