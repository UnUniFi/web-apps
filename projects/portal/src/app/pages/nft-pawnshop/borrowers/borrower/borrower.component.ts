import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ListedNfts200ResponseListingsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.css'],
})
export class BorrowerComponent implements OnInit {
  address$: Observable<string>;
  listedOwnNfts$: Observable<ListedNfts200ResponseListingsInner[]>;

  constructor(
    private readonly walletService: WalletService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
  ) {
    const currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.address$ = currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address).toString()),
    );
    this.listedOwnNfts$ = this.address$.pipe(
      mergeMap((address) =>
        this.pawnshopQuery
          .listAllListedNfts()
          .pipe(map((nfts) => nfts.filter((nft) => nft.owner == address))),
      ),
    );
  }

  ngOnInit(): void {}
}
