import { FaucetOnSubmitEvent } from '../../views/faucet/faucet.component';
import { FaucetUsecaseService } from './faucet.usecasa.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FaucetRequest } from 'projects/portal/src/app/models/faucets/faucet.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.css'],
})
export class FaucetComponent implements OnInit {
  denoms$: Observable<string[] | undefined>;
  address$: Observable<string>;
  denom$: Observable<string>;
  amount$: Observable<number>;
  creditAmount$: Observable<number>;
  maxCredit$: Observable<number>;
  faucetURL$: Observable<string | undefined>;

  constructor(private readonly route: ActivatedRoute, private usecase: FaucetUsecaseService) {
    this.address$ = this.route.queryParams.pipe(map((queryParams) => queryParams.address));
    this.amount$ = this.route.queryParams.pipe(map((queryParams) => queryParams.amount));
    this.denom$ = this.usecase.denom$(this.route.snapshot.queryParams.denom);

    this.denoms$ = this.usecase.denoms$;
    this.faucetURL$ = this.usecase.faucetURL$;
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

    this.usecase.postFaucetRequest(faucetRequest, faucetURL);
  }

  appSelectedDenomChange(selectedDenom: string): void {
    this.usecase.changeDenom(selectedDenom);
  }
}
