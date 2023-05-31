import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import {
  Proposals200ResponseProposalsInnerFinalTallyResult,
  Proposals200ResponseProposalsInner,
} from '@cosmos-client/core/esm/openapi';
import { CosmosSDKService } from 'projects/explorer/src/app/models/cosmos-sdk.service';
import { txParseProposalContent } from 'projects/explorer/src/app/utils/tx-parser';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css'],
})
export class ProposalsComponent implements OnInit {
  proposals$: Observable<Proposals200ResponseProposalsInner[]>;
  paginatedProposals$: Observable<Proposals200ResponseProposalsInner[]>;
  proposalContents$: Observable<(cosmosclient.proto.cosmos.gov.v1beta1.TextProposal | undefined)[]>;
  tallies$: Observable<
    { yes: number; no: number; abstain: number; noWithVeto: number; max: number }[]
  >;
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
      map((proposals) => (proposals.length ? proposals.length : undefined)),
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
      this.pageSize$,
    ]).pipe(
      map(([proposals, pageNumber, pageSize]) =>
        this.getPaginatedProposals(proposals, pageNumber, pageSize),
      ),
    );
    this.tallies$ = combineLatest([
      this.cosmosSDK.sdk$,
      this.proposals$,
      this.pageNumber$,
      this.pageSize$,
    ]).pipe(
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
      map((result) => result.map((res) => res?.data.tally)),
      map((tallies) =>
        tallies.map((tally) => {
          const yes = this.lnValue(tally?.yes);
          const no = this.lnValue(tally?.no);
          const abstain = this.lnValue(tally?.abstain);
          const noWithVeto = this.lnValue(tally?.no_with_veto);
          const max = Math.max(yes, no, abstain, noWithVeto);
          return { yes, no, abstain, noWithVeto, max };
        }),
      ),
    );
    this.proposalContents$ = combineLatest([
      this.proposals$,
      this.pageNumber$,
      this.pageSize$,
    ]).pipe(
      mergeMap(([proposals, pageNumber, pageSize]) =>
        combineLatest(
          this.getPaginatedProposals(proposals, pageNumber, pageSize).map((proposal) =>
            of(txParseProposalContent(proposal.content!)),
          ),
        ),
      ),
    );
  }

  ngOnInit(): void {}

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

  getPaginatedProposals(
    proposals: Proposals200ResponseProposalsInner[],
    pageNumber: number,
    pageSize: number,
  ): Proposals200ResponseProposalsInner[] {
    const max = proposals.length - (pageNumber - 1) * pageSize;
    const min = max - pageSize;
    return proposals.filter((_, i) => min <= i && i < max).reverse();
  }

  lnValue(value?: string) {
    if (!value) {
      return 0;
    } else if (!Number(value)) {
      return 0;
    } else {
      return Math.log(Number(value));
    }
  }
}
