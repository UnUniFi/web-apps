import { StoredWallet } from '../../../../models/wallets/wallet.model';
import { WalletService } from '../../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ListedNfts200ResponseListingsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-lender',
  templateUrl: './lender.component.html',
  styleUrls: ['./lender.component.css'],
})
export class LenderComponent implements OnInit {
  address$: Observable<string>;
  biddingNfts$: Observable<ListedNfts200ResponseListingsInner[]>;

  constructor(
    private readonly walletService: WalletService,
    private readonly pawnshopQueryService: NftPawnshopQueryService,
  ) {
    const currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.address$ = currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address).toString()),
    );
    const bidderBids = this.address$.pipe(
      mergeMap((address) => this.pawnshopQueryService.listBidderBids(address)),
    );
    this.biddingNfts$ = bidderBids.pipe(
      mergeMap((bids) =>
        Promise.all(
          bids.map(
            async (bid) =>
              await this.pawnshopQueryService
                .getNftListing(bid.nft_id?.class_id!, bid.nft_id?.nft_id!)
                .toPromise(),
          ),
        ),
      ),
    );
  }

  ngOnInit(): void {}
}
