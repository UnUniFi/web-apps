import { Nfts } from '../../../models/nft-pawnshops/nft-pawnshop.model';
import { NftPawnshopQueryService } from '../../../models/nft-pawnshops/nft-pawnshop.query.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ListedNfts200ResponseListingsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-borrowers',
  templateUrl: './borrowers.component.html',
  styleUrls: ['./borrowers.component.css'],
})
export class BorrowersComponent implements OnInit {
  address$: Observable<string>;
  ownNfts$: Observable<Nfts>;
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
    this.ownNfts$ = this.address$.pipe(
      mergeMap((address) => this.pawnshopQuery.listOwnNfts(address)),
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
