import { StakingApplicationService } from '../../../models/cosmos/staking.application.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { validatorType } from '../../../views/delegate/validators/validators.component';
import { ValidatorsUseCaseService } from './validators.usecase.service';
import { Component, OnInit } from '@angular/core';
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
  validators$: Observable<validatorType[]>;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  delegations$: Observable<InlineResponse20038DelegationResponses[] | undefined>;
  delegatedValidators$: Observable<(InlineResponse20041Validators | undefined)[] | undefined>;
  filteredUnbondingDelegations$: Observable<(InlineResponse20047 | undefined)[]>;
  activeEnabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private readonly stakingAppService: StakingApplicationService,
    private usecase: ValidatorsUseCaseService,
  ) {
    this.validators$ = this.usecase.validators$(this.activeEnabled);
    this.currentStoredWallet$ = this.usecase.currentStoredWallet$;
    this.delegations$ = this.usecase.delegations$;
    this.delegatedValidators$ = this.usecase.delegatedValidators$;
    this.filteredUnbondingDelegations$ = this.usecase.filteredUnbondingDelegations$;
  }

  ngOnInit() {}

  onToggleChange(value: boolean) {
    this.activeEnabled.next(value);
  }

  onSelectValidator(validator: InlineResponse20041Validators) {
    this.stakingAppService.openDelegateMenuDialog(validator);
  }
}
