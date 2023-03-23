import { BankQueryService } from '../../models/cosmos/bank.query.service';
import { FaucetApplicationService } from '../../models/faucets/faucet.application.service';
import { StoredWallet } from '../../models/wallets/wallet.model';
import { WalletService } from '../../models/wallets/wallet.service';
import { FaucetOnSubmitEvent } from '../../views/faucet/faucet.component';
import { FaucetUseCaseService } from './faucet.usecase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cosmos } from '@cosmos-client/core/esm/proto';
import { FaucetRequest } from 'projects/portal/src/app/models/faucets/faucet.model';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.css'],
})
export class FaucetComponent implements OnInit {
  faucetURL$: Observable<string | undefined>;
  address$: Observable<string>;
  symbols$: Observable<string[] | undefined>;
  symbol$: Observable<string>;
  amount$: Observable<number>;
  symbolMetadataMap$: Observable<{
    [symbol: string]: cosmos.bank.v1beta1.IMetadata;
  }>;
  creditAmount$: Observable<number>;
  maxCredit$: Observable<number>;

  constructor(
    private usecase: FaucetUseCaseService,
    private faucetApplication: FaucetApplicationService,
    private readonly bankQuery: BankQueryService,
    private readonly walletService: WalletService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    const microAmount$ = this.route.queryParams.pipe(map((queryParams) => queryParams.amount));
    const denom$ = this.route.queryParams.pipe(map((queryParams) => queryParams?.denom || 'uguu'));

    const denoms$ = this.usecase.denoms$;
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();
    this.symbols$ = combineLatest([denoms$, denomMetadataMap$]).pipe(
      map(([denoms, metadata]) =>
        denoms?.map((denom) => {
          const symbol = metadata[denom].symbol;
          return symbol || denom;
        }),
      ),
    );
    this.symbol$ = combineLatest([denom$, denomMetadataMap$]).pipe(
      map(([denom, metadata]) => metadata[denom].symbol || denom),
    );
    const unit$ = combineLatest([denom$, denomMetadataMap$]).pipe(
      map(([denom, metadata]) => metadata[denom].denom_units?.find((u) => u.denom == denom)),
    );

    this.amount$ = combineLatest([unit$, microAmount$]).pipe(
      map(([unit, microAmount]) => {
        if (microAmount) {
          return microAmount / 10 ** (unit?.exponent || 6);
        } else {
          return 0;
        }
      }),
    );
    this.faucetURL$ = this.usecase.faucetURL$(denom$);
    this.creditAmount$ = combineLatest([unit$, this.usecase.creditAmount$(denom$)]).pipe(
      map(([unit, amount]) => {
        return amount / 10 ** (unit?.exponent || 6);
      }),
    );
    this.maxCredit$ = combineLatest([unit$, this.usecase.maxCredit$(denom$)]).pipe(
      map(([unit, amount]) => {
        return amount / 10 ** (unit?.exponent || 6);
      }),
    );
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
