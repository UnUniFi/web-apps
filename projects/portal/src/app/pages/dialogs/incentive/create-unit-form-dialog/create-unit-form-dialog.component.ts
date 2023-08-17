import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { IncentiveApplicationService } from 'projects/portal/src/app/models/incentives/incentive.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { CreateIncentiveUnitOnSubmitEvent as RegisterIncentiveUnitOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/incentive/create-unit-form-dialog/create-unit-form-dialog.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-create-unit-form-dialog',
  templateUrl: './create-unit-form-dialog.component.html',
  styleUrls: ['./create-unit-form-dialog.component.css'],
})
export class CreateUnitFormDialogComponent implements OnInit {
  address: string | undefined;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;

  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: string,
    public dialogRef: DialogRef<string, CreateUnitFormDialogComponent>,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly incentiveApp: IncentiveApplicationService,
  ) {
    this.address = data;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

  // WIP
  async onSubmit($event: RegisterIncentiveUnitOnSubmitEvent) {}
}
