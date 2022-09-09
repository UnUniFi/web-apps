import { StakingApplicationService } from '../../../models/cosmos/staking.application.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { validatorType } from '../../../views/delegate/validators/validators.component';
import { ValidatorsUseCaseService } from './validators.usecase.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  InlineResponse20038DelegationResponses,
  InlineResponse20041Validators,
  InlineResponse20047,
} from '@cosmos-client/core/esm/openapi';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.css'],
})
export class ValidatorsComponent implements OnInit {
  private validatorsList$: Observable<InlineResponse20041Validators[] | undefined>;
  private accAddress$: Observable<cosmosclient.AccAddress>;

  validators$: Observable<validatorType[]>;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  delegations$: Observable<InlineResponse20038DelegationResponses[] | undefined>;
  delegatedValidators$: Observable<(InlineResponse20041Validators | undefined)[] | undefined>;
  unbondingDelegations$: Observable<(InlineResponse20047 | undefined)[]>;

  activeEnabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private readonly stakingAppService: StakingApplicationService,
    private usecase: ValidatorsUseCaseService,
  ) {
    this.currentStoredWallet$ = this.usecase.currentStoredWallet$;
    this.validatorsList$ = this.usecase.validatorsList$;
    this.accAddress$ = this.usecase.accAddress$;

    this.validators$ = this.usecase.validators$(this.validatorsList$, this.activeEnabled);
    this.delegations$ = this.usecase.delegations$(this.accAddress$);
    this.delegatedValidators$ = this.usecase.delegatedValidators$(
      this.validatorsList$,
      this.delegations$,
    );
    this.unbondingDelegations$ = this.usecase.unbondingDelegations$(
      this.delegatedValidators$,
      this.accAddress$,
    );
  }

  ngOnInit() {}

  onToggleChange(value: boolean) {
    this.activeEnabled.next(value);
  }

  onSelectValidator(validator: InlineResponse20041Validators) {
    this.stakingAppService.openDelegateMenuDialog(validator);
  }
}
