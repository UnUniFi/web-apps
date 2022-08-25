//import { Config, ConfigService } from '../../models/config.service';
import { CosmosRestService } from '../../../models/cosmos-rest.service';
import { txParseProposalContent } from './../../../../../../explorer/src/app/utils/tx-parser';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  InlineResponse20027FinalTallyResult,
  InlineResponse20027Proposals,
} from '@cosmos-client/core/esm/openapi/api';
import { combineLatest, of, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProposalsUseCaseService {
  private proposalsInService$: Observable<InlineResponse20027Proposals[]>;
  constructor(private readonly cosmosRest: CosmosRestService) {
    this.proposalsInService$ = this.cosmosRest.getProposals$().pipe(map((res) => res!));
  }

  get proposals$(): Observable<InlineResponse20027Proposals[]> {
    return this.proposalsInService$;
  }
  get pageLength$() {
    return this.proposalsInService$.pipe(
      map((proposals) => (proposals?.length ? proposals.length : undefined)),
    );
  }
  paginatedProposals$(
    pageNumber$: Observable<number>,
    pageSize$: Observable<number>,
  ): Observable<InlineResponse20027Proposals[]> {
    return combineLatest([this.proposalsInService$, pageNumber$, pageSize$]).pipe(
      map(([proposals, pageNumber, pageSize]) =>
        this.getPaginatedProposals(proposals, pageNumber, pageSize),
      ),
    );
  }
  proposalContents$(
    pageNumber$: Observable<number>,
    pageSize$: Observable<number>,
  ): Observable<(cosmosclient.proto.cosmos.gov.v1beta1.TextProposal | undefined)[]> {
    return combineLatest([this.proposalsInService$, pageNumber$, pageSize$]).pipe(
      mergeMap(([proposals, pageNumber, pageSize]) =>
        combineLatest(
          this.getPaginatedProposals(proposals, pageNumber, pageSize).map((proposal) =>
            of(txParseProposalContent(proposal.content!)),
          ),
        ),
      ),
    );
  }
  tallies$(
    pageNumber$: Observable<number>,
    pageSize$: Observable<number>,
  ): Observable<(InlineResponse20027FinalTallyResult | undefined)[]> {
    return combineLatest([this.proposalsInService$, pageNumber$, pageSize$]).pipe(
      mergeMap(([proposals, pageNumber, pageSize]) =>
        combineLatest(
          this.getPaginatedProposals(proposals, pageNumber, pageSize).map((proposal) =>
            this.cosmosRest.getTallyResult$(proposal.proposal_id!),
          ),
        ),
      ),
    );
  }

  private getPaginatedProposals(
    proposals: InlineResponse20027Proposals[],
    pageNumber: number,
    pageSize: number,
  ): InlineResponse20027Proposals[] {
    if ((proposals?.length || 0) > 0) {
      const max = proposals.length - (pageNumber - 1) * pageSize;
      const min = max - pageSize;
      return proposals.filter((_, i) => min <= i && i < max).reverse();
    } else {
      return [];
    }
  }
}
