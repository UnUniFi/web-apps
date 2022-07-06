import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import {
  InlineResponse20027FinalTallyResult,
  InlineResponse20027Proposals,
} from '@cosmos-client/core/esm/openapi';
import { CosmosSDKService } from 'projects/explorer/src/app/models/cosmos-sdk.service';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css'],
})
export class ProposalsComponent implements OnInit {
  proposals$: Observable<InlineResponse20027Proposals[]>;
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
    private readonly cosmosSDK: CosmosSDKService,
  ) {
    this.proposals$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.gov.proposals(sdk.rest)),
      map((result) => result.data.proposals!),
    );


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
    this.tallies$ = combineLatest([this.cosmosSDK.sdk$, this.proposals$, this.pageNumber$,
    this.pageSize$]).pipe(
      mergeMap(([sdk, proposals, pageNumber, pageSize]) =>
        Promise.all(
          this.getPaginatedProposals(proposals, pageNumber, pageSize).map((proposal) =>
            cosmosclient.rest.gov.tallyresult(sdk.rest, proposal.proposal_id!).catch((err) => {
              console.log(err);
              return;
            }),
          ),
        ),
      ),
      map((result) => result.map((res) => (res ? res.data.tally! : undefined))),
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

  getPaginatedProposals(proposals: InlineResponse20027Proposals[], pageNumber: number, pageSize: number): InlineResponse20027Proposals[] {
    const max = proposals.length - (pageNumber - 1) * pageSize;
    const min = max - pageSize;
    return proposals.filter((_, i) => min <= i && i < max).reverse()
  }
}
