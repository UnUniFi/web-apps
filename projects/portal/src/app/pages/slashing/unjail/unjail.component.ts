import { SlashingApplicationService } from '../../../models/cosmos/slashing.application.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { createCosmosPublicKeyFromString } from '../../../utils/key';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cosmosclient, proto } from '@cosmos-client/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-unjail',
  templateUrl: './unjail.component.html',
  styleUrls: ['./unjail.component.css'],
})
export class UnjailComponent implements OnInit {
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

  ngOnInit(): void {}

  async appSubmitUnjail(unjailData: {
    validator_address: string;
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
  }): Promise<void> {
    const gasRatio = 1.1;
    await this.slashingApplicationService.unjail(
      unjailData.validator_address,
      unjailData.minimumGasPrice,
      gasRatio,
    );
  }
}
