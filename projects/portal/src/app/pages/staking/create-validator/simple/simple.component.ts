import { StakingApplicationService } from '../../../../models/cosmos/staking.application.service';
import { CreateValidatorData } from '../../../../models/cosmos/staking.model';
import { StoredWallet } from '../../../../models/wallets/wallet.model';
import { WalletService } from '../../../../models/wallets/wallet.service';
import { createCosmosPublicKeyFromString } from '../../../../utils/key';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cosmosclient, proto } from '@cosmos-client/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.css'],
})
export class SimpleComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  moniker$: Observable<string>;
  identity$: Observable<string>;
  website$: Observable<string>;
  security_contact$: Observable<string>;
  details$: Observable<string>;
  rate$: Observable<string>;
  max_rate$: Observable<string>;
  max_change_rate$: Observable<string>;
  min_self_delegation$: Observable<string>;
  delegator_address$: Observable<string>;
  validator_address$: Observable<string>;
  denom$: Observable<string>;
  amount$: Observable<string>;
  ip$: Observable<string>;
  node_id$: Observable<string>;
  pubkey$: Observable<string>;
  minimumGasPrices$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly stakingApplicationService: StakingApplicationService,
    private readonly configS: ConfigService,
  ) {
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.moniker$ = this.route.queryParams.pipe(
      filter((queryParams) => queryParams.moniker),
      map((queryParams) => queryParams.moniker),
    );
    this.identity$ = this.route.queryParams.pipe(
      filter((queryParams) => queryParams.identity),
      map((queryParams) => queryParams.identity),
    );
    this.website$ = this.route.queryParams.pipe(
      filter((queryParams) => queryParams.website),
      map((queryParams) => queryParams.website),
    );
    this.security_contact$ = this.route.queryParams.pipe(
      filter((queryParams) => queryParams.security_contact),
      map((queryParams) => queryParams.security_contact),
    );
    this.details$ = this.route.queryParams.pipe(
      filter((queryParams) => queryParams.details),
      map((queryParams) => queryParams.details),
    );
    this.rate$ = this.route.queryParams.pipe(
      filter((queryParams) => queryParams.rate),
      map((queryParams) => queryParams.rate),
    );
    this.max_rate$ = this.route.queryParams.pipe(
      filter((queryParams) => queryParams.max_rate),
      map((queryParams) => queryParams.max_rate),
    );
    this.max_change_rate$ = this.route.queryParams.pipe(
      filter((queryParams) => queryParams.max_change_rate),
      map((queryParams) => queryParams.max_change_rate),
    );
    this.min_self_delegation$ = this.route.queryParams.pipe(
      filter((queryParams) => queryParams.min_self_delegation),
      map((queryParams) => queryParams.min_self_delegation),
    );
    this.delegator_address$ = combineLatest([
      this.route.queryParams,
      this.currentStoredWallet$,
    ]).pipe(
      filter(
        ([queryParams, currentStoredWallet]) =>
          queryParams.delegator_address &&
          currentStoredWallet?.address &&
          currentStoredWallet.key_type &&
          currentStoredWallet.public_key,
      ),
      map(([queryParams, currentStoredWallet]) => {
        if (
          currentStoredWallet?.address &&
          currentStoredWallet.public_key &&
          currentStoredWallet.key_type
        ) {
          const cosmosPublicKey = createCosmosPublicKeyFromString(
            currentStoredWallet.key_type,
            currentStoredWallet.public_key,
          );
          if (!cosmosPublicKey) {
            return undefined;
          }
          const accAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
          if (accAddress.toAccAddress().toString() === queryParams.delegator_address) {
            return queryParams.delegator_address;
          } else {
            return undefined;
          }
        }
        return queryParams.delegator_address;
      }),
    );
    this.validator_address$ = combineLatest([
      this.route.queryParams,
      this.currentStoredWallet$,
    ]).pipe(
      filter(
        ([queryParams, currentStoredWallet]) =>
          queryParams.validator_address ||
          (currentStoredWallet?.address &&
            currentStoredWallet.public_key &&
            currentStoredWallet.key_type),
      ),
      map(([queryParams, currentStoredWallet]) => {
        if (
          currentStoredWallet?.address &&
          currentStoredWallet.public_key &&
          currentStoredWallet.key_type
        ) {
          const cosmosPublicKey = createCosmosPublicKeyFromString(
            currentStoredWallet.key_type,
            currentStoredWallet.public_key,
          );
          if (!cosmosPublicKey) {
            return undefined;
          }
          const accAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
          const valAddress = cosmosclient.ValAddress.fromPublicKey(cosmosPublicKey);
          if (accAddress.toAccAddress().toString() === queryParams.delegator_address) {
            return valAddress.toValAddress().toString();
          } else {
            return undefined;
          }
        }
        return queryParams.validator_address;
      }),
    );
    this.denom$ = this.route.queryParams.pipe(
      filter((queryParams) => queryParams.denom),
      map((queryParams) => queryParams.denom),
    );
    this.amount$ = this.route.queryParams.pipe(
      filter((queryParams) => queryParams.amount),
      map((queryParams) => queryParams.amount),
    );
    this.ip$ = this.route.queryParams.pipe(
      filter((queryParams) => queryParams.ip),
      map((queryParams) => queryParams.ip),
    );
    this.node_id$ = this.route.queryParams.pipe(
      filter((queryParams) => queryParams.node_id),
      map((queryParams) => queryParams.node_id),
    );
    this.pubkey$ = this.route.queryParams.pipe(
      filter((queryParams) => queryParams.pubkey),
      map((queryParams) => queryParams.pubkey),
    );

    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

  async appSubmitCreateValidator(
    createValidatorData: CreateValidatorData & {
      minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
    },
  ): Promise<void> {
    await this.stakingApplicationService.createValidator(
      createValidatorData,
      createValidatorData.minimumGasPrice,
    );
  }
}
