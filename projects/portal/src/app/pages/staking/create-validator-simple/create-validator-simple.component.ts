import { StakingApplicationService } from '../../../models/cosmos/staking.application.service';
import { CreateValidatorData } from '../../../models/cosmos/staking.model';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-create-validator-simple',
  templateUrl: './create-validator-simple.component.html',
  styleUrls: ['./create-validator-simple.component.css'],
})
export class CreateValidatorSimpleComponent implements OnInit {
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
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;

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
    this.delegator_address$ = this.route.queryParams.pipe(
      filter((queryParams) => queryParams.delegator_address),
      map((queryParams) => queryParams.delegator_address),
    );
    this.validator_address$ = combineLatest([this.route.queryParams, this.delegator_address$]).pipe(
      filter(
        ([queryParams, delegator_address]) => queryParams.validator_address || delegator_address,
      ),
      map(([queryParams, delegator_address]) => {
        if (!delegator_address) {
          return undefined;
        }
        const accAddress = cosmosclient.AccAddress.fromString(delegator_address);
        const valAddress = accAddress.toValAddress();
        if (!queryParams?.validator_address) {
          return valAddress.toString();
        }
        if (queryParams.validator_address !== valAddress.toString()) {
          return undefined;
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

  ngOnInit(): void { }

  async appSubmitCreateValidator(
    createValidatorData: CreateValidatorData & {
      minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
      privateKey: string;
    },
  ): Promise<void> {
    const gasRatio = 1.1;
    await this.stakingApplicationService.createValidatorSimple(
      createValidatorData,
      createValidatorData.minimumGasPrice,
      createValidatorData.privateKey,
      gasRatio,
    );
  }
}
