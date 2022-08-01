import { FaucetApplicationService } from '../../models/faucets/faucet.application.service';
import { FaucetOnSubmitEvent } from '../../views/faucet/faucet.component';
import { Component, OnInit } from '@angular/core';
import { FaucetUseCaseService } from "./faucet.usecase.service"
import { Config } from 'projects/portal/src/app/models/config.service';
import { FaucetRequest } from 'projects/portal/src/app/models/faucets/faucet.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.css'],
})
export class FaucetComponent implements OnInit {
  config$: Observable<Config | undefined>;
  denoms$: Observable<string[] | undefined>;
  address$: Observable<string>;
  denom$: BehaviorSubject<string>;
  amount$: Observable<number>;
  creditAmount$: Observable<number>;
  maxCredit$: Observable<number>;

  constructor(
    private usecase: FaucetUseCaseService,
    private faucetApplication: FaucetApplicationService,
  ) {
    this.config$ = this.usecase.config$;
    this.denoms$ = this.usecase.denoms$;
    this.address$ = this.usecase.address$;
    this.denom$ = this.usecase.denom$;
    this.amount$ = this.usecase.amount$;
    this.creditAmount$ = this.usecase.creditAmount$;
    this.maxCredit$ = this.usecase.maxCredit$;
  }

  ngOnInit(): void { }

  appPostFaucetRequested($event: FaucetOnSubmitEvent): void {
    const faucetURL = $event.url;
    const faucetRequest: FaucetRequest = {
      address: $event.address,
      coins: [
        {
          amount: $event.amount,
          denom: $event.denom,
        },
      ],
    };
    this.faucetApplication.postFaucetRequest(faucetRequest, faucetURL);
  }

  appSelectedDenomChange(selectedDenom: string): void {
    this.denom$?.next(selectedDenom);
  }
}
