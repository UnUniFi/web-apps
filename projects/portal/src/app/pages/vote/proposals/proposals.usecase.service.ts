import { CosmosRestService } from '../../../models/cosmos-rest.service';
import { txParseProposalContent } from './../../../../../../explorer/src/app/utils/tx-parser';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  GovV1Proposal200ResponseProposalsInnerFinalTallyResult,
  GovV1Proposal200ResponseProposalsInner,
} from '@cosmos-client/core/esm/openapi/api';
import { combineLatest, of, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProposalsUseCaseService {
  constructor(private readonly cosmosRest: CosmosRestService) {}

  get proposals$(): Observable<GovV1Proposal200ResponseProposalsInner[]> {
    return this.cosmosRest.getProposals$().pipe(map((res) => res ?? []));
  }
  pageLength$(proposals$: Observable<GovV1Proposal200ResponseProposalsInner[]>) {
    return proposals$.pipe(map((proposals) => (proposals?.length ? proposals.length : undefined)));
  }
  paginatedProposals$(
    proposals$: Observable<GovV1Proposal200ResponseProposalsInner[]>,
    pageNumber$: Observable<number>,
    pageSize$: Observable<number>,
  ): Observable<GovV1Proposal200ResponseProposalsInner[]> {
    return combineLatest([proposals$, pageNumber$, pageSize$]).pipe(
      map(([proposals, pageNumber, pageSize]) =>
        this.getPaginatedProposals(proposals, pageNumber, pageSize),
      ),
    );
  }
  tallies$(
    proposals$: Observable<GovV1Proposal200ResponseProposalsInner[]>,
    pageNumber$: Observable<number>,
    pageSize$: Observable<number>,
  ): Observable<(GovV1Proposal200ResponseProposalsInnerFinalTallyResult | undefined)[]> {
    return combineLatest([proposals$, pageNumber$, pageSize$]).pipe(
      mergeMap(([proposals, pageNumber, pageSize]) =>
        combineLatest(
          this.getPaginatedProposals(proposals, pageNumber, pageSize)?.map((proposal) => {
            return this.cosmosRest.getTallyResult$(proposal.id!);
          }),
        ),
      ),
    );
  }

  private getPaginatedProposals(
    proposals: GovV1Proposal200ResponseProposalsInner[],
    pageNumber: number,
    pageSize: number,
  ): GovV1Proposal200ResponseProposalsInner[] {
    if ((proposals?.length || 0) > 0) {
      const max = proposals.length - (pageNumber - 1) * pageSize;
      const min = max - pageSize;
      return proposals.filter((_, i) => min <= i && i < max).reverse();
    } else {
      return [];
    }
  }
}
