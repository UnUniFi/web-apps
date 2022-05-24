import { StakingApplicationService } from '../../../models/cosmos/staking.application.service';
import { EditValidatorData } from '../../../models/cosmos/staking.model';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cosmosclient, proto } from '@cosmos-client/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-validator-simple',
  templateUrl: './edit-validator-simple.component.html',
  styleUrls: ['./edit-validator-simple.component.css'],
})
export class EditValidatorSimpleComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  moniker$: Observable<string>;
  identity$: Observable<string>;
  website$: Observable<string>;
  security_contact$: Observable<string>;
  details$: Observable<string>;
  rate$: Observable<string>;
  min_self_delegation$: Observable<string>;
  delegator_address$: Observable<string>;
  validator_address$: Observable<string>;
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

    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

  async appSubmitEditValidator(
    editValidatorData: EditValidatorData & {
      minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
      privateKey: string;
    },
  ): Promise<void> {
    const gasRatio = 1.1;
    await this.stakingApplicationService.editValidatorSimple(
      editValidatorData,
      editValidatorData.minimumGasPrice,
      editValidatorData.privateKey,
      gasRatio,
      { disableRedirect: false, disableErrorSnackBar: false, disableSimulate: false },
    );
  }
}
