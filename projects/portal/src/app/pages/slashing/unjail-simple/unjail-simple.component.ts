import { SlashingApplicationService } from '../../../models/cosmos/slashing.application.service';
import { StakingApplicationService } from '../../../models/cosmos/staking.application.service';
import { CreateValidatorData } from '../../../models/cosmos/staking.model';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cosmosclient, proto } from '@cosmos-client/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-unjail-simple',
  templateUrl: './unjail-simple.component.html',
  styleUrls: ['./unjail-simple.component.css'],
})
export class UnjailSimpleComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  delegator_address$: Observable<string>;
  validator_address$: Observable<string>;
  minimumGasPrices$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly slashingApplicationService: SlashingApplicationService,
    private readonly configS: ConfigService,
  ) {
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
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

  async appSubmitUnjail($event: {
    validator_address: string;
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
    privateKey: string;
  }): Promise<void> {
    console.log('appSubmitUnjail');
    const gasRatio = 1.1;
    await this.slashingApplicationService.unjailSimple(
      $event.validator_address,
      $event.minimumGasPrice,
      gasRatio,
      $event.privateKey,
    );
  }
}
