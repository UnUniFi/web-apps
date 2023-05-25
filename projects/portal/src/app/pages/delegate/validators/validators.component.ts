import { StakingApplicationService } from '../../../models/cosmos/staking.application.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { validatorType } from '../../../views/delegate/validators/validators.component';
import { ValidatorsUseCaseService } from './validators.usecase.service';
import { Component, OnInit } from '@angular/core';
import {
  DelegatorDelegations200ResponseDelegationResponsesInner,
  StakingDelegatorValidators200ResponseValidatorsInner,
  UnbondingDelegation200Response,
} from '@cosmos-client/core/esm/openapi';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.css'],
})
export class ValidatorsComponent implements OnInit {
  validators$: Observable<validatorType[]>;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  delegations$: Observable<DelegatorDelegations200ResponseDelegationResponsesInner[] | undefined>;
  delegatedValidators$: Observable<
    (StakingDelegatorValidators200ResponseValidatorsInner | undefined)[] | undefined
  >;
  unbondingDelegations$: Observable<(UnbondingDelegation200Response | undefined)[]>;

  private activeEnabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private readonly stakingAppService: StakingApplicationService,
    private usecase: ValidatorsUseCaseService,
  ) {
    this.currentStoredWallet$ = this.usecase.currentStoredWallet$;
    this.validators$ = this.usecase.validators$(this.activeEnabled);
    this.delegations$ = this.usecase.delegations$;
    this.delegatedValidators$ = this.usecase.delegatedValidators$(this.delegations$);
    this.unbondingDelegations$ = this.usecase.unbondingDelegations$(this.delegatedValidators$);
  }

  ngOnInit() {}

  onToggleChange(value: boolean) {
    this.activeEnabled.next(value);
  }
  onSelectValidator(validator: StakingDelegatorValidators200ResponseValidatorsInner) {
    this.stakingAppService.openDelegateMenuDialog(validator);
  }
}
