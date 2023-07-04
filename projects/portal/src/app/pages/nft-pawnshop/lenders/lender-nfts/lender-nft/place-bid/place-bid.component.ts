import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { denomExponentMap } from 'projects/portal/src/app/models/cosmos/bank.model';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { NftPawnshopApplicationService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.application.service';
import { NftPawnshopChartService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.chart.service';
import { PlaceBidRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { NftPawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { combineLatest, Observable, zip } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  BidderBids200ResponseBidsInner,
  ListedNfts200ResponseListingsInnerListing,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-place-bid',
  templateUrl: './place-bid.component.html',
  styleUrls: ['./place-bid.component.css'],
})
export class PlaceBidComponent implements OnInit {
  classID$: Observable<string>;
  nftID$: Observable<string>;
  symbol$: Observable<string | null | undefined>;
  symbolImage$: Observable<string | undefined>;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  balance$: Observable<number>;
  listingInfo$: Observable<ListedNfts200ResponseListingsInnerListing>;
  bids$: Observable<BidderBids200ResponseBidsInner[]>;
  bidAmount$: Observable<number | undefined>;
  depositAmount$: Observable<number | undefined>;
  interestRate$: Observable<number>;
  nftMetadata$: Observable<Metadata>;
  nftImage$: Observable<string>;
  chartData$: Observable<(string | number)[][]>;

  constructor(
    private route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly pawnshop: NftPawnshopService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
    private readonly pawnshopChart: NftPawnshopChartService,
    private readonly pawnshopApp: NftPawnshopApplicationService,
  ) {
    this.classID$ = this.route.params.pipe(map((params) => params.class_id));
    this.nftID$ = this.route.params.pipe(map((params) => params.nft_id));
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    const nftCombine$ = combineLatest([this.classID$, this.nftID$]);
    this.listingInfo$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getNftListing$(classID, nftID)),
    );
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.symbol$ = combineLatest([this.listingInfo$, denomMetadataMap$]).pipe(
      map(([info, metadata]) => metadata[info.bid_token || ''].symbol),
    );
    this.symbolImage$ = this.symbol$.pipe(
      map((symbol) => this.bankQuery.symbolImages().find((i) => i.symbol === symbol)?.image),
    );
    const balanceMap$ = address$.pipe(
      mergeMap((address) => this.bankQuery.getSymbolBalanceMap$(address)),
    );
    this.balance$ = zip(balanceMap$, this.symbol$).pipe(
      map(([balance, symbol]) => balance[symbol || '']),
    );
    this.bids$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.listNftBids$(classID, nftID)),
      map((bids) =>
        bids.sort((a, b) => parseInt(b.bid_amount?.amount!) - parseInt(a.bid_amount?.amount!)),
      ),
    );
    const maxBidAmount$ = this.bids$.pipe(
      map((bids) => bids.reduce((max, bid) => Math.max(max, parseInt(bid.bid_amount?.amount || '0')), 0)),
    );
    this.bidAmount$ = combineLatest([this.listingInfo$, maxBidAmount$]).pipe(
      map(([info, maxBidAmount]) => {
        if (!maxBidAmount) {
          return undefined
        }
        const exponent = denomExponentMap[info.bid_token || '']
        return maxBidAmount / 10 ** exponent
      }),
    );
    this.depositAmount$ = combineLatest([this.listingInfo$, maxBidAmount$]).pipe(
      map(([info, maxBidAmount]) => {
        if (!maxBidAmount) {
          return undefined
        }
        const exponent = denomExponentMap[info.bid_token || '']
        return Math.floor(maxBidAmount * Number(info.minimum_deposit_rate || '0')) / 10 ** exponent
      }),
    );
    this.interestRate$ = this.bids$.pipe(
      map((bids) => bids.reduce((min, bid) => Math.min(min, Number(bid.deposit_lending_rate || '0')) * 100, 5.5)),
    );
    const nftData$ = nftCombine$.pipe(
      mergeMap(([classID, nftID]) => this.pawnshopQuery.getNft$(classID, nftID)),
    );
    this.nftMetadata$ = nftData$.pipe(
      mergeMap((nft) => this.pawnshop.getMetadataFromUri(nft.nft?.uri || '')),
    );
    this.nftImage$ = nftData$.pipe(
      mergeMap((nft) => this.pawnshop.getImageFromUri(nft.nft?.uri || '')),
    );

    this.chartData$ = this.bids$.pipe(
      map((bids) => this.pawnshopChart.createBidAmountChartData(bids)),
      map((data) => data.sort((a, b) => Number(a[1]) - Number(b[1]))),
    );
  }

  ngOnInit(): void { }

  onSimulate(data: PlaceBidRequest) {
    const bidAmount = data.bidAmount;
    const date = data.biddingPeriod.toLocaleString();
    const rate = data.depositLendingRate;
    const secondaryColor = '#EC0BA1';
    this.chartData$ = this.bids$.pipe(
      map((bids) => this.pawnshopChart.createBidAmountChartData(bids)),
      map((data) => {
        data[data.length] = [date, bidAmount, secondaryColor, rate + '%'];
        return data;
      }),
      map((data) => data.sort((a, b) => Number(a[1]) - Number(b[1]))),
    );
  }

  onSubmit(data: PlaceBidRequest) {
    this.pawnshopApp.placeBid(
      data.classID,
      data.nftID,
      data.symbol,
      data.bidAmount,
      data.biddingPeriod,
      data.depositLendingRate / 100,
      data.autoPayment,
      data.depositAmount,
    );
  }
}
