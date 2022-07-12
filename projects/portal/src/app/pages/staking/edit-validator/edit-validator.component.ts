import { StakingApplicationService } from '../../../models/cosmos/staking.application.service';
import { EditValidatorData } from '../../../models/cosmos/staking.model';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { createCosmosPublicKeyFromString } from '../../../utils/key';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-validator',
  templateUrl: './edit-validator.component.html',
  styleUrls: ['./edit-validator.component.css'],
})
export class EditValidatorComponent implements OnInit {
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

    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void { }

  async appSubmitEditValidator(
    editValidatorData: EditValidatorData & {
      minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
    },
  ): Promise<void> {
    await this.stakingApplicationService.editValidator(
      editValidatorData,
      editValidatorData.minimumGasPrice,
      1.1,
      { disableRedirect: false, disableErrorSnackBar: false, disableSimulate: false },
    );
  }
}
