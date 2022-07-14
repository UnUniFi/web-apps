import { CosmosRestService } from '../../../models/cosmos-rest.service';
import { GovApplicationService } from '../../../models/cosmos/gov.application.service';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
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
  paginatedProposals$: Observable<InlineResponse20027Proposals[]>;
  tallies$: Observable<(InlineResponse20027FinalTallyResult | undefined)[]>;

  pageSizeOptions = [5, 10, 15];
  pageSize$: Observable<number>;
  pageNumber$: Observable<number>;
  pageLength$: Observable<number | undefined>;
  defaultPageSize = this.pageSizeOptions[1];
  defaultPageNumber = 1;

  constructor(
    private router: Router,
    private readonly route: ActivatedRoute,
    private readonly govAppService: GovApplicationService,
    private readonly cosmosRest: CosmosRestService,
  ) {
    this.proposals$ = this.cosmosRest.getProposals$().pipe(map((res) => res!));
    this.pageLength$ = this.proposals$.pipe(
      map((proposals) =>
        proposals.length ? proposals.length : undefined,
      ),
    );
    this.pageSize$ = this.route.queryParams.pipe(
      map((params) => {
        const pageSize = Number(params.perPage);
        if (this.pageSizeOptions.includes(pageSize)) {
          return pageSize;
        } else {
          return this.defaultPageSize;
        }
      }),
    );
    this.pageNumber$ = combineLatest([
      this.pageLength$,
      this.pageSize$,
      this.route.queryParams,
    ]).pipe(
      map(([pageLength, pageSize, params]) => {
        if (pageLength === undefined) {
          return this.defaultPageNumber;
        }
        const pages = Number(params.pages);
        if (!pages) return this.defaultPageNumber;
        if (pages > pageLength / pageSize + 1) return this.defaultPageNumber;
        return pages;
      }),
    );
    this.paginatedProposals$ = combineLatest([
      this.proposals$,
      this.pageNumber$,
      this.pageSize$]).pipe(
        map(([proposals, pageNumber, pageSize]) => this.getPaginatedProposals(proposals, pageNumber, pageSize))
      )
    this.tallies$ = combineLatest([
      this.proposals$, this.pageNumber$, this.pageSize$]).pipe(
        mergeMap(([proposals, pageNumber, pageSize]) =>
          combineLatest(
            this.getPaginatedProposals(proposals, pageNumber, pageSize).map((proposal) => this.cosmosRest.getTallyResult$(proposal.proposal_id!)),
          ),
        ),
      );
    this.proposalContents$ = combineLatest([
      this.proposals$, this.pageNumber$, this.pageSize$]).pipe(
        mergeMap(([proposals, pageNumber, pageSize]) =>
          combineLatest(
            this.getPaginatedProposals(proposals, pageNumber, pageSize).map((proposal) => of(txParseProposalContent(proposal.content!)))
          ),
        ),
      );
  }

  ngOnInit(): void { }

  appPaginationChanged(pageEvent: PageEvent): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        perPage: pageEvent.pageSize,
        pages: pageEvent.pageIndex + 1,
      },
      queryParamsHandling: 'merge',
    });
  }

  onVoteProposal(proposalID: number) {
    this.govAppService.openVoteFormDialog(proposalID);
  }

  getPaginatedProposals(proposals: InlineResponse20027Proposals[], pageNumber: number, pageSize: number): InlineResponse20027Proposals[] {
    const max = proposals.length - (pageNumber - 1) * pageSize;
    const min = max - pageSize;
    return proposals.filter((_, i) => min <= i && i < max).reverse()
  }
}
