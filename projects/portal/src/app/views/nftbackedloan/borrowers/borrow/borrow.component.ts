import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Chart } from 'chart.js';
import { getDenomExponent } from 'projects/portal/src/app/models/cosmos/bank.model';
import { NftPawnshopChartService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.chart.service';
import { BorrowRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import ununificlient from 'ununifi-client';
import {
  ListedNfts200ResponseListingsInnerListing,
  NftBids200ResponseBidsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.css'],
})
export class BorrowComponent implements OnInit, OnChanges {
  @Input()
  classID?: string | null;
  @Input()
  nftID?: string | null;
  @Input()
  listingInfo?: ListedNfts200ResponseListingsInnerListing | null;
  @Input()
  symbol?: string | null;
  @Input()
  symbolMetadataMap?: {
    [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata;
  } | null;
  @Input()
  symbolImage?: string | null;
  @Input()
  bids?: NftBids200ResponseBidsInner[] | null;
  @Input()
  borrowAmount?: number | null;
  @Input()
  selectedBorrowAmount?: number | null;
  @Input()
  nftMetadata?: Metadata | null;
  @Input()
  nftImage?: string | null;
  @Input()
  chartData?: (string | number)[][] | null;

  chart?: Chart<any>;
  contextChart?: CanvasRenderingContext2D;

  autoBorrow = true;
  autoBorrowBids: ununificlient.proto.ununifi.nftbackedloan.IBorrowBid[] = [];
  shortestExpiryDate = new Date();
  averageInterestRate = 0;

  selectedBidder?: string;
  selectedBids: { address: string; amount: number }[] = [];

  @Output()
  appSubmit: EventEmitter<BorrowRequest>;

  constructor(
    private readonly pawnshopChart: NftPawnshopChartService,
    private readonly nftPawnshopService: NftPawnshopService,
  ) {
    this.appSubmit = new EventEmitter();
  }

  @ViewChild('canvasChart') canvasChart?: ElementRef;

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.onChangeBorrowAmount();
    this.contextChart = this.canvasChart?.nativeElement.getContext('2d');
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.contextChart && this.bids && this.listingInfo?.bid_denom) {
      this.chart = this.pawnshopChart.createExpiryDepositChart(
        this.contextChart,
        this.pawnshopChart.convertChartData(this.bids, this.listingInfo.bid_denom),
      );
    }
  }

  onToggleAuto(auto: boolean) {
    this.autoBorrow = auto;
  }

  onChangeBorrowAmount() {
    if (this.bids && this.selectedBorrowAmount && this.symbol && this.symbolMetadataMap) {
      this.autoBorrowBids = this.nftPawnshopService.autoBorrowBids(
        this.bids,
        this.selectedBorrowAmount,
        this.symbol,
        this.symbolMetadataMap,
      );
      this.averageInterestRate = this.nftPawnshopService.averageInterestRate(
        this.bids,
        this.autoBorrowBids,
      );
      this.shortestExpiryDate = this.nftPawnshopService.shortestExpiryDate(
        this.bids,
        this.autoBorrowBids,
      );
      const exponent = getDenomExponent(this.listingInfo?.bid_denom);
      this.selectedBids = this.autoBorrowBids.map((bid) => {
        return { address: bid.bidder!, amount: Number(bid.amount?.amount) / 10 ** exponent };
      });
    }
  }

  isAlreadySelectedBidder(bidderAddr: string) {
    return this.selectedBids.some((b) => b.address === bidderAddr);
  }

  onClickAddBidder() {
    if (!this.selectedBidder) {
      alert('Please select a bid.');
      return;
    }
    this.selectedBids.push({
      address: this.selectedBidder,
      amount: 0,
    });
    this.selectedBidder = undefined;
  }

  onClickDeleteBidder(index: number) {
    this.selectedBids.splice(index, 1);
  }

  onSubmit() {
    if (!this.classID || !this.nftID) {
      alert('Invalid NFT Info!');
      return;
    }

    if (this.autoBorrow) {
      this.appSubmit.emit({
        classID: this.classID,
        nftID: this.nftID,
        borrowBids: this.autoBorrowBids,
      });
    } else {
      if (!this.symbol || !this.symbolMetadataMap) {
        alert('Invalid Token!');
        return;
      }
      const borrowBids = this.nftPawnshopService.convertBorrowBids(
        this.selectedBids,
        this.symbol,
        this.symbolMetadataMap!,
      );
      this.appSubmit.emit({
        classID: this.classID,
        nftID: this.nftID,
        borrowBids,
      });
    }
  }
}
