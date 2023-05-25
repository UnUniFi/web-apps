import { StoredWallet } from '../../../../models/wallets/wallet.model';
import { WalletService } from '../../../../models/wallets/wallet.service';
import { BidderNftsInfo } from '../lenders.component';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { BankService } from 'projects/portal/src/app/models/cosmos/bank.service';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ListedNfts200ResponseListingsInnerListing } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-lender',
  templateUrl: './lender.component.html',
  styleUrls: ['./lender.component.css'],
})
export class LenderComponent implements OnInit {
  address$: Observable<string>;
  symbolDepositMap$: Observable<{ [symbol: string]: number }>;
  symbolLendMap$: Observable<{ [symbol: string]: number }>;
  biddingNfts$: Observable<ListedNfts200ResponseListingsInnerListing[]>;
  biddingNftsInfo$: Observable<BidderNftsInfo>;
  nftsMetadata$: Observable<Metadata[]>;
  nftImages$: Observable<string[]>;

  constructor(
    private readonly bankService: BankService,
    private readonly bankQuery: BankQueryService,
    private readonly walletService: WalletService,
    private readonly pawnshop: NftPawnshopService,
    private readonly pawnshopQueryService: NftPawnshopQueryService,
  ) {
    const currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.address$ = currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address).toString()),
    );

    const bidderBids$ = this.address$.pipe(
      mergeMap((address) => this.pawnshopQueryService.listBidderBids$(address)),
    );
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    const deposits$ = bidderBids$.pipe(
      map((bids) => {
        let sumDeposits: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] = [];
        for (const bid of bids) {
          const index = sumDeposits.findIndex(
            (deposit) => deposit.denom == bid.deposit_amount?.denom,
          );
          if (index == -1) {
            sumDeposits.push(bid.deposit_amount!);
          } else {
            const addedAmount =
              Number(sumDeposits[index].amount) + Number(bid.deposit_amount?.amount);
            sumDeposits[index] = {
              amount: addedAmount.toString(),
              denom: bid.deposit_amount?.denom,
            };
          }
        }
        return sumDeposits;
      }),
    );
    this.symbolDepositMap$ = combineLatest([deposits$, denomMetadataMap$]).pipe(
      map(([deposits, denomMetadataMap]) =>
        this.bankService.convertCoinsToSymbolAmount(deposits, denomMetadataMap),
      ),
    );

    const lends$ = bidderBids$.pipe(
      map((bids) => {
        let sumBorrows: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] = [];
        for (const bid of bids) {
          if (bid.borrowings) {
            for (const borrowing of bid.borrowings) {
              const index = sumBorrows.findIndex(
                (borrow) => borrow.denom == borrowing.amount?.denom,
              );
              if (index == -1) {
                sumBorrows.push(borrowing.amount!);
              } else {
                const addedAmount =
                  Number(sumBorrows[index].amount) + Number(borrowing.amount?.amount);
                sumBorrows[index] = {
                  amount: addedAmount.toString(),
                  denom: borrowing.amount?.denom,
                };
              }
            }
          }
        }
        return sumBorrows;
      }),
    );

    this.symbolLendMap$ = combineLatest([lends$, denomMetadataMap$]).pipe(
      map(([lends, denomMetadataMap]) =>
        this.bankService.convertCoinsToSymbolAmount(lends, denomMetadataMap),
      ),
    );

    this.biddingNfts$ = bidderBids$.pipe(
      mergeMap((bids) =>
        Promise.all(
          bids.map(async (bid) => {
            if (bid.nft_id && bid.nft_id.class_id && bid.nft_id.nft_id) {
              return await this.pawnshopQueryService.getNftListing(
                bid.nft_id?.class_id!,
                bid.nft_id?.nft_id!,
              );
            } else {
              return {};
            }
          }),
        ),
      ),
    );
    this.biddingNftsInfo$ = this.biddingNfts$.pipe(
      map((nfts) => {
        const bidding = nfts.filter((nft) => nft.state == 'BIDDING').length;
        const selling = nfts.filter((nft) => nft.state == 'SELLING_DECISION').length;
        const ends = nfts.filter((nft) => nft.state == 'END_LISTING').length;
        const successfulBids = nfts.filter((nft) => nft.state == 'SUCCESSFUL_BID').length;
        return {
          bidding: bidding,
          selling_decision: selling,
          end_listing: ends,
          successful_bid: successfulBids,
        };
      }),
    );

    const nfts$ = this.biddingNfts$.pipe(
      mergeMap((nfts) => {
        return Promise.all(
          nfts.map(async (nft) => {
            if (nft) {
              const nftData = await this.pawnshopQueryService.getNft(
                nft.nft_id?.class_id!,
                nft.nft_id?.nft_id!,
              );
              return nftData;
            } else {
              return {};
            }
          }),
        );
      }),
    );

    this.nftsMetadata$ = nfts$.pipe(
      mergeMap((nfts) => {
        return Promise.all(
          nfts.map(async (nft) => {
            const imageUri = await this.pawnshop.getMetadataFromUri(nft.nft?.uri || '');
            return imageUri;
          }),
        );
      }),
    );

    this.nftImages$ = nfts$.pipe(
      mergeMap((nfts) => {
        return Promise.all(
          nfts.map(async (nft) => {
            const imageUri = await this.pawnshop.getImageFromUri(nft.nft?.uri || '');
            return imageUri;
          }),
        );
      }),
    );
  }

  ngOnInit(): void {}
}
