import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { DerivativesApplicationService } from '../../../models/derivatives/derivatives.application.service';
import { DerivativesQueryService } from '../../../models/derivatives/derivatives.query.service';
import { WalletService } from '../../../models/wallets/wallet.service';
import { BurnLPTEvent, MintLPTEvent } from '../../../views/derivatives/pool/pool.component';
import { Component, OnInit } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit {
  pool$ = this.derivativesQuery.getPool$();
  params$ = this.derivativesQuery.getDerivativesParams$().pipe(map((params) => params?.pool));
  denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
  // TODO: route guard for wallet may be needed
  symbolBalanceMap$ = this.walletService.currentCosmosWallet$.pipe(
    mergeMap((wallet) => this.bankQuery.getSymbolBalanceMap$(wallet?.address.toString() || '')),
  );

  constructor(
    private readonly walletService: WalletService,
    private readonly derivativesQuery: DerivativesQueryService,
    private readonly bankQuery: BankQueryService,
    private readonly derivativesApplication: DerivativesApplicationService,
  ) {}

  ngOnInit(): void {}

  async onMintLPT($event: MintLPTEvent) {
    await this.derivativesApplication.mintLiquidityProviderToken($event.symbol, $event.amount);
  }

  async onBurnLPT($event: BurnLPTEvent) {
    await this.derivativesApplication.burnLiquidityProviderToken(
      $event.amount,
      $event.redeemSymbol,
    );
  }
}
