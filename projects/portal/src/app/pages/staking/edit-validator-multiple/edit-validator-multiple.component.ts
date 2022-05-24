import { StakingApplicationService } from '../../../models/cosmos/staking.application.service';
import { EditValidatorData } from '../../../models/cosmos/staking.model';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GraphQLErrors, NetworkError } from '@apollo/client/errors';
import { ErrorLink } from '@apollo/client/link/error';
import { cosmosclient, proto } from '@cosmos-client/core';
import { Apollo, gql } from 'apollo-angular';
import { GraphQLError } from 'graphql';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';

export type InterfaceEditValidatorsDataItem = EditValidatorData & {
  minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
  privateKey: string;
};

export type InterfaceEditValidatorsData = InterfaceEditValidatorsDataItem[];
const getUserNodesQuery = () => gql`
  query getNodes($getNodesInput: GetNodesInput!) {
    getNodes(getNodesInput: $getNodesInput) {
      items {
        nodeId
        subNode
      }
    }
  }
`;

@Component({
  selector: 'app-edit-validator-multiple',
  templateUrl: './edit-validator-multiple.component.html',
  styleUrls: ['./edit-validator-multiple.component.css'],
})
export class EditValidatorMultipleComponent implements OnInit {
  userId: string | null;
  nodes$: Observable<any[]>;
  success: boolean = false;
  loading: boolean = true;
  error: string = '';
  minimumGasPrices$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  redirectUrls: string[] = [];
  constructor(
    private readonly route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly stakingApplicationService: StakingApplicationService,
    private readonly configS: ConfigService,
    private apollo: Apollo,
  ) {
    this.nodes$ = of([]);
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  setError(error: string) {
    this.error = error;
  }

  setSuccess(success: boolean) {
    this.success = success;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }
  getNodes(userId: string | null): Observable<any> {
    if (!userId) return this.nodes$;
    this.setLoading(true);
    const query = getUserNodesQuery();
    return this.apollo.watchQuery({
      query: query,
      variables: {
        getNodesInput: {
          query: {
            userId,
            nodeType: 'UNUNIFI_VALIDATOR_NODE',
          },
        },
      },
    }).valueChanges;
  }

  ngOnInit(): void {
    this.nodes$ = this.getNodes(this.userId).pipe(
      tap((result) => {
        this.loading = result.loading;
      }),
      filter((result) => !result.loading),
      map((result) => result.data.getNodes.items),
      catchError(
        ({
          graphQLErrors,
          networkError,
        }: {
          graphQLErrors: GraphQLErrors;
          networkError: NetworkError;
        }) => {
          this.setLoading(false);
          this.setError('Error: something went wrong. Please reload and try again');
          if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }: GraphQLError) =>
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
              ),
            );

          if (networkError) console.log(`[Network error]: ${JSON.stringify(networkError)}`);
          return of([]);
        },
      ),
    );
  }

  async appSubmitEditValidators(editValidatorsData: InterfaceEditValidatorsData): Promise<void> {
    const gasRatio = 1.1;
    const results = (await Promise.all(
      editValidatorsData.map(async (editValidatorData) => {
        return this.stakingApplicationService.editValidatorSimple(
          editValidatorData,
          editValidatorData.minimumGasPrice,
          editValidatorData.privateKey,
          gasRatio,
          { disableRedirect: true, disableErrorSnackBar: true, disableSimulate: true },
        );
      }),
    )) as (string | undefined)[];
    const success = results.length > 0 && results.every((result: string | undefined) => !!result);
    if (success) {
      this.redirectUrls = editValidatorsData.map(
        (editValidatorData) =>
          `${location.protocol}//${location.host}/explorer/validators/${editValidatorData.validator_address}`,
      );
      this.setSuccess(true);
    } else {
      this.setError('Error: something went wrong. Reload and try again or contact us');
      this.setSuccess(false);
    }
  }
}
