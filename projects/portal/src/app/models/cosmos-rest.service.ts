import { CosmosSDKService } from './cosmos-sdk.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import {
  CosmosDistributionV1beta1QueryCommunityPoolResponse as CommunityPoolResponse,
  CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse as DelegationTotalRewardsResponse,
  CosmosDistributionV1beta1QueryValidatorSlashesResponse as ValidatorSlashesResponse,
  CosmosMintV1beta1QueryAnnualProvisionsResponse as AnnualProvisionsResponse,
  CosmosMintV1beta1QueryInflationResponse as InflationResponse,
  CosmosTxV1beta1GetTxResponse as TxResponse,
  CosmosTxV1beta1GetTxsEventResponse as TxsEventResponse,
  GetLatestBlock200Response as BlockResponse,
  GetNodeInfo200Response as NodeInfoResponse,
  ValidatorOutstandingRewards200Response as RewardsResponse,
  GovParams200ResponseDepositParams as DepositParams,
  GovParams200ResponseTallyParams as TallyParams,
  GovParams200ResponseVotingParams as VotingParams,
  Proposals200ResponseProposalsInnerFinalTallyResult as TallyResult,
  Proposals200ResponseProposalsInner as Proposals,
  Deposits200ResponseDepositsInner as Deposits,
  Votes200ResponseVotesInner as Votes,
  DelegatorDelegations200Response as DelegatorDelegationsResponse,
  AllBalances200ResponseBalancesInner as Balances,
  StakingDelegatorValidators200Response as DelegatorValidatorsResponse,
  StakingDelegatorValidators200ResponseValidatorsInner as Validators,
  UnbondingDelegation200Response as UnboundingDelegationResponse,
  AccountsAreTheExistingAccountsInner as Accounts,
  QueryTotalSupplyResponseIsTheResponseTypeForTheQueryTotalSupplyRPCMethod as TotalSupplyResponse,
  QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod as ValidatorCommissionResponse,
} from '@cosmos-client/core/esm/openapi';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, pluck, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CosmosRestService {
  private restSdk$: Observable<CosmosSDK>;

  constructor(private cosmosSDK: CosmosSDKService) {
    this.restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));
  }

  getNodeInfo$(): Observable<NodeInfoResponse> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.tendermint.getNodeInfo(sdk)),
      map((res) => res.data),
    );
  }

  getSyncing$(): Observable<boolean> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.tendermint.getSyncing(sdk)),
      map((res) => res.data.syncing || false),
    );
  }

  getLatestBlock$(): Observable<BlockResponse> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.tendermint.getLatestBlock(sdk)),
      map((res) => res.data),
    );
  }

  getTx$(hash: string): Observable<TxResponse> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.tx.getTx(sdk, hash)),
      map((res) => res.data),
    );
  }

  getAllBalances$(cosmosAccAddress: cosmosclient.AccAddress): Observable<Balances[] | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.bank.allBalances(sdk, cosmosAccAddress)),
      map((res) => res.data.balances),
      catchError(this._handleError),
    );
  }

  getTotalSupply$(): Observable<TotalSupplyResponse> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.bank.totalSupply(sdk)),
      map((res) => res.data),
    );
  }

  getAccount$(cosmosAccAddress: cosmosclient.AccAddress): Observable<Accounts | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.auth.account(sdk, cosmosAccAddress)),
      tap((res) => console.log(res.data.account)),
      map((res) => res.data.account),
      catchError(this._handleError),
    );
  }

  getAccountTxsEvent$(address: string): Observable<TxsEventResponse | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        cosmosclient.rest.tx.getTxsEvent(
          sdk,
          [`message.sender='${address}'`],
          undefined,
          undefined,
          undefined,
          true,
        ),
      ),
      map((res) => res.data),
      catchError(this._handleError),
    );
  }

  getSelectedTxTypeEvent$(
    selectedTxType: string,
    paginationOffset?: bigint | undefined,
    paginationLimit?: bigint | undefined,
  ): Observable<TxsEventResponse> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        cosmosclient.rest.tx.getTxsEvent(
          sdk,
          [`message.module='${selectedTxType}'`],
          undefined,
          paginationOffset,
          paginationLimit,
          true,
        ),
      ),
      map((res) => res.data),
    );
  }

  getDelegationTotalRewards$(
    accAddress: cosmosclient.AccAddress,
  ): Observable<DelegationTotalRewardsResponse | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.distribution.delegationTotalRewards(sdk, accAddress)),
      map((res) => res.data),
      catchError(this._handleError),
    );
  }

  getDelegatorDelegations$(
    address: cosmosclient.AccAddress,
  ): Observable<DelegatorDelegationsResponse> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.staking.delegatorDelegations(sdk, address)),
      map((res) => res.data),
    );
  }

  getDelegatorValidators$(
    address: cosmosclient.AccAddress,
  ): Observable<DelegatorValidatorsResponse> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.staking.delegatorValidators(sdk, address)),
      map((res) => res.data),
    );
  }

  getUnbondingDelegation$(
    validatorAddr: cosmosclient.ValAddress,
    delegatorAddr: cosmosclient.AccAddress,
  ): Observable<UnboundingDelegationResponse> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        cosmosclient.rest.staking.unbondingDelegation(sdk, validatorAddr, delegatorAddr),
      ),
      map((res) => res.data),
    );
  }

  getValidators$(): Observable<Validators[] | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.staking.validators(sdk)),
      map((res) => res.data.validators),
    );
  }

  getValidator$(valAddress: cosmosclient.ValAddress): Observable<Validators | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.staking.validator(sdk, valAddress)),
      map((res) => res.data.validator),
      catchError(this._handleError),
    );
  }

  getValidatorCommission$(
    validatorAddress: cosmosclient.ValAddress,
  ): Observable<ValidatorCommissionResponse | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.distribution.validatorCommission(sdk, validatorAddress)),
      map((res) => res.data),
      catchError(this._handleError),
    );
  }

  getValidatorOutstandingRewards$(
    valAddress: cosmosclient.ValAddress,
  ): Observable<RewardsResponse | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        cosmosclient.rest.distribution.validatorOutstandingRewards(sdk, valAddress),
      ),
      map((res) => res.data),
      catchError(this._handleError),
    );
  }

  getValidatorSlashes$(
    valAddress: cosmosclient.ValAddress,
    startingHeight?: string,
    endingHeight?: string,
  ): Observable<ValidatorSlashesResponse | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        cosmosclient.rest.distribution.validatorSlashes(
          sdk,
          valAddress,
          startingHeight,
          endingHeight,
        ),
      ),
      map((res) => res.data),
      catchError(this._handleError),
    );
  }

  getProposals$(): Observable<Proposals[] | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.gov.proposals(sdk)),
      map((res) => res.data.proposals),
      catchError(this._handleError),
    );
  }

  getProposal$(proposalId: string): Observable<Proposals | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.gov.proposal(sdk, proposalId)),
      map((res) => res.data.proposal),
      catchError(this._handleError),
    );
  }

  getVotingParams$(): Observable<VotingParams | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.gov.params(sdk, 'voting')),
      map((res) => res.data.voting_params),
      catchError(this._handleError),
    );
  }

  getTallyParams$(): Observable<TallyParams | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.gov.params(sdk, 'tally')),
      map((res) => res.data.tally_params),
      catchError(this._handleError),
    );
  }

  getDepositParams$(): Observable<DepositParams | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.gov.params(sdk, 'deposit')),
      map((res) => res.data.deposit_params),
      catchError(this._handleError),
    );
  }

  getDeposits$(proposalId: string): Observable<Deposits[] | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.gov.deposits(sdk, proposalId)),
      map((res) => res.data.deposits),
      catchError(this._handleError),
    );
  }

  getVotes$(proposalId: string): Observable<Votes[] | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.gov.votes(sdk, proposalId)),
      map((res) => res.data.votes),
      catchError(this._handleError),
    );
  }

  getTallyResult$(proposalId: string): Observable<TallyResult | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.gov.tallyresult(sdk, proposalId)),
      map((res) => res.data.tally),
      catchError(this._handleError),
    );
  }

  getAnnualProvisions$(): Observable<AnnualProvisionsResponse> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.mint.annualProvisions(sdk)),
      map((res) => res.data),
    );
  }

  getInflation$(): Observable<InflationResponse> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.mint.inflation(sdk)),
      map((res) => res.data),
    );
  }

  getCommunityPool$(): Observable<CommunityPoolResponse> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.distribution.communityPool(sdk)),
      map((res) => res.data),
    );
  }

  private _handleError(error: any): Observable<undefined> {
    console.error(error);
    return of(undefined);
  }
}
