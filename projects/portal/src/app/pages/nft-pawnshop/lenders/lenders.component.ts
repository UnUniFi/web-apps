import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { NftPawnshopApplicationService } from '../../../models/nft-pawnshops/nft-pawnshop.application.service';
import { NftPawnshopQueryService } from '../../../models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from '../../../models/nft-pawnshops/nft-pawnshop.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { LendParams } from '../../../views/nft-pawnshop/lenders/lenders.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  BidderBids200ResponseBidsInner,
  ListedClass200Response,
  ListedNfts200ResponseListingsInner,
} from 'ununifi-client/esm/openapi';

export interface BidderNftsInfo {
  bidding: number;
  selling_decision: number;
  end_listing: number;
  successful_bid: number;
}

@Component({
  selector: 'app-lenders',
  templateUrl: './lenders.component.html',
  styleUrls: ['./lenders.component.css'],
})
export class LendersComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  balances$: Observable<{ [symbol: string]: number }>;
  bidderBids$: Observable<BidderBids200ResponseBidsInner[]>;
  depositCoins$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;
  lendCoins$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;
  biddingNfts$: Observable<ListedNfts200ResponseListingsInner[]>;
  biddingNftsInfo$: Observable<BidderNftsInfo>;
  rewards$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;
  listedClasses$: Observable<ListedClass200Response[]>;
  classImages$: Observable<string[]>;
  listedNfts$: Observable<ListedNfts200ResponseListingsInner[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly pawnshop: NftPawnshopService,
    private readonly pawnshopApp: NftPawnshopApplicationService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
  ) {
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    this.balances$ = address$.pipe(
      mergeMap((address) => this.bankQuery.getSymbolBalanceMap$(address)),
    );
    this.bidderBids$ = address$.pipe(
      mergeMap((address) => this.pawnshopQuery.listBidderBids$(address)),
    );
    this.depositCoins$ = this.bidderBids$.pipe(
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
    this.lendCoins$ = this.bidderBids$.pipe(
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

    this.biddingNfts$ = this.bidderBids$.pipe(
      mergeMap((bids) =>
        Promise.all(
          bids.map(async (bid) => {
            if (bid.nft_id && bid.nft_id.class_id && bid.nft_id.nft_id) {
              return await this.pawnshopQuery.getNftListing(
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

    this.rewards$ = address$.pipe(mergeMap((address) => this.pawnshopQuery.listRewards$(address)));
    this.listedNfts$ = this.pawnshopQuery.listAllListedNfts$();
    const allListedClasses$ = this.pawnshopQuery.listAllListedClasses$();

    const metadata$ = this.bankQuery.getDenomMetadata$();
    this.listedClasses$ = combineLatest([
      allListedClasses$,
      this.listedNfts$,
      metadata$,
      this.route.queryParams,
    ]).pipe(
      map(([classes, nfts, metadata, params]) => {
        const symbol = params.symbol;
        if (!symbol) {
          return classes;
        }
        const selectedMetadata = metadata.find((data) => data.symbol == symbol);
        if (!selectedMetadata) {
          return [];
        }
        const filteredNfts = nfts.filter(
          (nft) => nft.bid_token == selectedMetadata.denom_units![0].denom,
        );
        return classes.filter((value) =>
          filteredNfts.find((nft) => nft.nft_id?.class_id == value.class_id),
        );
      }),
    );

    this.classImages$ = this.listedClasses$.pipe(
      mergeMap((classes) =>
        Promise.all(
          classes.map(async (nftClass) => {
            if (!nftClass.uri) {
              return '';
            }
            const imageUri = await this.pawnshop.getImageFromUri(nftClass.uri);
            return imageUri;
          }),
        ),
      ),
    );
  }

  ngOnInit(): void {}

  onSubmit(symbol: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        symbol: symbol,
      },
      queryParamsHandling: 'merge',
    });
  }

  onViewClass(params: LendParams) {
    localStorage.setItem('lendAmount', params.deposit.amount.toString());
    localStorage.setItem('lendSymbol', params.deposit.symbol);
    localStorage.setItem('lendRate', params.interestRate.toString());
    localStorage.setItem('lendTerm', params.repaymentTerm.toISOString());
    this.pawnshopApp.openNftsDialog(params.classID);
  }
}