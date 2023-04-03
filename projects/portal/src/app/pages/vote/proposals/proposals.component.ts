import { GovApplicationService } from '../../../models/cosmos/gov.application.service';
import { ProposalsUseCaseService } from './proposals.usecase.service';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import {
  Proposals200ResponseProposalsInnerFinalTallyResult,
  Proposals200ResponseProposalsInner,
  Proposals200ResponseProposalsInnerStatusEnum,
} from '@cosmos-client/core/esm/openapi/api';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css'],
})
export class ProposalsComponent implements OnInit {
  paginatedProposals$: Observable<Proposals200ResponseProposalsInner[]>;
  tallies$: Observable<
    { yes: number; no: number; abstain: number; noWithVeto: number; max: number }[]
  >;
  proposalContents$: Observable<(cosmosclient.proto.cosmos.gov.v1beta1.TextProposal | undefined)[]>;
  pageSize$: Observable<number>;
  pageNumber$: Observable<number>;
  pageLength$: Observable<number | undefined>;
  pageSizeOptions = [5, 10, 15];

  private proposals$: Observable<Proposals200ResponseProposalsInner[]>;
  private defaultPageSize = this.pageSizeOptions[1];
  private defaultPageNumber = 1;

  constructor(
    private router: Router,
    private usecase: ProposalsUseCaseService,
    private readonly route: ActivatedRoute,
    private readonly govAppService: GovApplicationService,
  ) {
    const proposals: Proposals200ResponseProposalsInner[] = [
      {
        proposal_id: '1',
        content: { type_url: 'cosmos.gov.v1beta1.TextProposal', value: 'test' },
        status: 'PROPOSAL_STATUS_DEPOSIT_PERIOD',
        final_tally_result: { yes: '30', abstain: '1', no: '3', no_with_veto: '1' },
        submit_time: '2021-05-01T00:00:00Z',
        deposit_end_time: '2021-05-01T00:00:00Z',
        total_deposit: [{ denom: 'uguu', amount: '1' }],
        voting_start_time: '2021-05-01T00:00:00Z',
        voting_end_time: '2021-05-01T00:00:00Z',
      },
      {
        proposal_id: '2',
        content: { type_url: 'cosmos.gov.v1beta1.TextProposal', value: 'test' },
        status: 'PROPOSAL_STATUS_PASSED',
        final_tally_result: { yes: '40', abstain: '5', no: '2', no_with_veto: '1' },
        submit_time: '2021-05-01T00:00:00Z',
        deposit_end_time: '2021-05-01T00:00:00Z',
        total_deposit: [{ denom: 'uguu', amount: '1' }],
        voting_start_time: '2021-05-01T00:00:00Z',
        voting_end_time: '2021-05-01T00:00:00Z',
      },
    ];
    this.proposals$ = of(proposals);
    // this.proposals$ = this.usecase.proposals$;
    this.pageLength$ = this.usecase.pageLength$(this.proposals$);
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
    this.paginatedProposals$ = this.usecase.paginatedProposals$(
      this.proposals$,
      this.pageNumber$,
      this.pageSize$,
    );
    this.proposalContents$ = this.usecase.proposalContents$(
      this.proposals$,
      this.pageNumber$,
      this.pageSize$,
    );
    this.tallies$ = this.usecase.tallies$(this.proposals$, this.pageNumber$, this.pageSize$).pipe(
      map((tallies) =>
        tallies.map((tally) => {
          const yes = tally?.yes ? Number(tally.yes) : 0;
          const no = tally?.no ? Number(tally.no) : 0;
          const abstain = tally?.abstain ? Number(tally.abstain) : 0;
          const noWithVeto = tally?.no_with_veto ? Number(tally.no_with_veto) : 0;
          const max = Math.max(yes, no, abstain, noWithVeto);
          return { yes, no, abstain, noWithVeto, max };
        }),
      ),
    );
    this.tallies$ = of([
      { yes: 10, no: 2, abstain: 3, noWithVeto: 4, max: 10 },
      { yes: 10, no: 10, abstain: 2, noWithVeto: 5, max: 10 },
    ]);
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

  onVoteProposal(proposalID: number) {
    this.govAppService.openVoteFormDialog(proposalID);
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
}
