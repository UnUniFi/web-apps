import { DerivativesApplicationService } from '../../../models/derivatives/derivatives.application.service';
import { DerivativesQueryService } from '../../../models/derivatives/derivatives.query.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { ClosePositionEvent } from '../../../views/derivatives/positions/positions.component';
import { Component, OnInit } from '@angular/core';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css'],
})
export class PositionsComponent implements OnInit {
  address$ = this.walletService.currentStoredWallet$.pipe(
    filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
    map((wallet) => wallet.address),
  );
  positions$ = this.address$.pipe(
    mergeMap((address) => this.derivativesQuery.listAddressPositions$(address)),
  );

  constructor(
    private readonly walletService: WalletService,
    private readonly derivativesQuery: DerivativesQueryService,
    private readonly derivativesApplication: DerivativesApplicationService,
  ) {}

  ngOnInit(): void {}

  async onClosePosition($event: ClosePositionEvent) {
    await this.derivativesApplication.closePosition($event.positionId);
  }
}
