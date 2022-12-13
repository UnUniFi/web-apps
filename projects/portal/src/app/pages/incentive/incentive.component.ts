import { IncentiveApplicationService } from '../../models/incentives/incentive.application.service';
import { UnunifiRestService } from '../../models/ununifi-rest.service';
import { StoredWallet } from '../../models/wallets/wallet.model';
import { WalletService } from '../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { CdpAll200ResponseCdpInnerCdpCollateral } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-incentive',
  templateUrl: './incentive.component.html',
  styleUrls: ['./incentive.component.css'],
})
export class IncentiveComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  units$: Observable<{ id: string }[]>;
  rewards$: Observable<CdpAll200ResponseCdpInnerCdpCollateral[]>;

  constructor(
    private readonly incentiveApp: IncentiveApplicationService,
    private readonly walletService: WalletService,
    private ununifiRest: UnunifiRestService,
  ) {
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );
    this.rewards$ = address$.pipe(
      mergeMap((address) => this.ununifiRest.getAllRewards$(address.toString())),
    );

    // Dummy data
    this.units$ = of([{ id: 'incentiveUnitId1' }, { id: 'incentiveUnitId2' }]);
    this.rewards$ = of([{ denom: 'uguu', amount: '20000000' }]);
  }

  ngOnInit(): void {}

  onClickCreate() {
    this.incentiveApp.openCreateUnitFormDialog('');
  }
}
