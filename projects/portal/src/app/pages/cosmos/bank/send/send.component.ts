import { CosmosSDKService } from '../../../../models/cosmos-sdk.service';
import { BankApplicationService } from '../../../../models/cosmos/bank.application.service';
import { SendOnSubmitEvent } from '../../../../views/cosmos/bank/send/send.component';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cosmosclient, proto, rest } from '@cosmos-client/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
})
export class SendComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  coins$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  amount$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  minimumGasPrices$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;

  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly walletService: WalletService,
    private readonly bankApplication: BankApplicationService,
    private readonly snackBar: MatSnackBar,
    private readonly configS: ConfigService,
  ) {
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;

    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );

    this.coins$ = combineLatest([this.cosmosSDK.sdk$, address$]).pipe(
      mergeMap(([sdk, address]) => rest.bank.allBalances(sdk.rest, address)),
      map((result) => result.data.balances),
    );

    this.amount$ = this.coins$.pipe(
      map((amount) =>
        amount?.map((coin) => ({
          denom: coin.denom,
          amount: '0',
        })),
      ),
    );

    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

  async onSubmit($event: SendOnSubmitEvent) {
    if ($event.amount.length === 0) {
      this.snackBar.open('Invalid coins', undefined, {
        duration: 6000,
      });
      return;
    }
    await this.bankApplication.send(
      $event.toAddress,
      $event.amount,
      $event.minimumGasPrice,
      $event.coins,
    );
  }
}
