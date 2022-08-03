import { FaucetApplicationService } from '../../models/faucets/faucet.application.service';
import { FaucetOnSubmitEvent } from '../../views/faucet/faucet.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Config } from 'projects/portal/src/app/models/config.service';
import { FaucetUseCaseService } from "./faucet.usecase.service"
import { FaucetRequest } from 'projects/portal/src/app/models/faucets/faucet.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.css'],
})
export class FaucetComponent implements OnInit {
  faucetURL$: Observable<string | undefined>;
  denoms$: Observable<string[] | undefined>;
  address$: Observable<string>;
  denom$: Observable<string>;
  amount$: Observable<number>;
  creditAmount$: Observable<number>;
  maxCredit$: Observable<number>;

  constructor(
    private usecase: FaucetUseCaseService,
    private faucetApplication: FaucetApplicationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.address$ = this.route.queryParams.pipe(map((queryParams) => queryParams.address));
    this.amount$ = this.route.queryParams.pipe(map((queryParams) => queryParams.amount));
    this.denom$ = this.route.queryParams.pipe(map((queryParams) => queryParams?.denom));

    this.denoms$ = this.usecase.denoms$;
    this.faucetURL$ = this.usecase.faucetURL$(this.denom$);
    this.creditAmount$ = this.usecase.creditAmount$(this.denom$);
    this.maxCredit$ = this.usecase.maxCredit$(this.denom$);
  }

  ngOnInit(): void {}

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
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        denom: selectedDenom,
      },
      queryParamsHandling: 'merge',
    });
  }
}
