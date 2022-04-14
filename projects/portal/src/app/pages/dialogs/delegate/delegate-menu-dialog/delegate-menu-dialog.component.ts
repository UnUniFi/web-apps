import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { cosmosclient, rest } from '@cosmos-client/core';
import { delegation } from '@cosmos-client/core/cjs/rest/slashing/module';
import {
  InlineResponse20063,
  InlineResponse20066,
  InlineResponse20066Validators,
} from '@cosmos-client/core/esm/openapi/api';
import { CosmosSDKService } from 'projects/portal/src/app/models';
import { StakingApplicationService } from 'projects/portal/src/app/models/cosmos/staking.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-delegate-menu-dialog',
  templateUrl: './delegate-menu-dialog.component.html',
  styleUrls: ['./delegate-menu-dialog.component.css'],
})
export class DelegateMenuDialogComponent implements OnInit {
  selectedValidator: InlineResponse20066Validators | undefined;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  delegations$: Observable<InlineResponse20063>;
  isDelegated$: Observable<boolean | undefined> | undefined;
  // validators$: Observable<InlineResponse20066>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: InlineResponse20066Validators,
    private router: Router,
    public matDialogRef: MatDialogRef<DelegateMenuDialogComponent>,
    private readonly stakingAppService: StakingApplicationService,
    private readonly walletService: WalletService,
    private readonly cosmosSDK: CosmosSDKService,
  ) {
    this.selectedValidator = data;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );
    this.delegations$ = combineLatest([this.cosmosSDK.sdk$, address$]).pipe(
      mergeMap(([sdk, address]) => rest.staking.delegatorDelegations(sdk.rest, address)),
      map((res) => res.data),
    );
    this.delegations$.subscribe((a) => console.log(a));
    this.isDelegated$ = this.delegations$.pipe(
      map((delegations) =>
        delegations.delegation_responses?.some(
          (response) =>
            response.delegation?.validator_address == this.selectedValidator?.operator_address,
        ),
      ),
    );
  }

  ngOnInit() {}

  onSubmitDelegate(validator: InlineResponse20066Validators) {
    this.matDialogRef.close();
    this.stakingAppService.openDelegateFormDialog(validator);
  }

  onSubmitDetail(validator: InlineResponse20066Validators) {
    this.matDialogRef.close();
    this.router.navigate(['delegate', 'validators', validator.operator_address]);
  }
}
