import { Nfts } from '../../models/nft-pawnshops/nft-pawnshop.model';
import { NftPawnshopQueryService } from '../../models/nft-pawnshops/nft-pawnshop.query.service';
import { StoredWallet } from '../../models/wallets/wallet.model';
import { WalletService } from '../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  ListedClass200Response,
  ListedNfts200ResponseListingsInner,
  NftBackedLoanParams200ResponseParams,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-nft-pawnshop',
  templateUrl: './nft-pawnshop.component.html',
  styleUrls: ['./nft-pawnshop.component.css'],
})
export class NftPawnshopComponent implements OnInit {
  params$: Observable<NftBackedLoanParams200ResponseParams>;
  listedClasses$: Observable<ListedClass200Response[]>;
  listedNfts$: Observable<ListedNfts200ResponseListingsInner[]>;
  ownNfts$: Observable<Nfts>;
  listedOwnNfts$: Observable<ListedNfts200ResponseListingsInner[]>;

  constructor(
    private readonly walletService: WalletService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
  ) {
    this.params$ = this.pawnshopQuery.getNftBackedLoanParam$();
    this.listedClasses$ = this.pawnshopQuery.listAllListedClasses$();
    this.listedNfts$ = this.pawnshopQuery.listAllListedNfts$();

    const currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address).toString()),
    );
    this.ownNfts$ = address$.pipe(mergeMap((address) => this.pawnshopQuery.listOwnNfts$(address)));
    this.listedOwnNfts$ = combineLatest([address$, this.listedNfts$]).pipe(
      map(([address, listedNfts]) => listedNfts.filter((nft) => nft.listing?.owner == address)),
    );
  }

  ngOnInit(): void {}
}
