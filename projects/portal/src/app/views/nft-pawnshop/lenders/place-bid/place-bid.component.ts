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
import Chart from 'chart.js/auto';
import { NftPawnshopChartService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.chart.service';
import { PlaceBidRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import {
  ListedNfts200ResponseListingsInnerListing,
  BidderBids200ResponseBidsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-place-bid',
  templateUrl: './place-bid.component.html',
  styleUrls: ['./place-bid.component.css'],
})
export class PlaceBidComponent implements OnInit, OnChanges {
  @Input()
  classID?: string | null;
  @Input()
  nftID?: string | null;
  @Input()
  symbol?: string | null;
  @Input()
  symbolImage?: string | null;
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  balance?: number | null;
  @Input()
  listingInfo?: ListedNfts200ResponseListingsInnerListing | null;
  @Input()
  bids?: BidderBids200ResponseBidsInner[] | null;
  @Input()
  bidAmount?: number | null;
  @Input()
  depositAmount?: number | null;
  @Input()
  interestRate?: number | null;
  @Input()
  nftMetadata?: Metadata | null;
  @Input()
  nftImage?: string | null;
  @Input()
  chartData?: (string | number)[][] | null;
  @Input()
  date?: string | null;
  @Input()
  time?: string | null;
  minimumDeposit: number = 0;
  autoPayment: boolean = true;

  activeInterestChart = true;
  chart?: Chart<any>;
  contextChart?: CanvasRenderingContext2D;

  @Output()
  appSimulate: EventEmitter<PlaceBidRequest>;
  @Output()
  appSubmit: EventEmitter<PlaceBidRequest>;

  constructor(private readonly pawnshopChart: NftPawnshopChartService) {
    this.appSimulate = new EventEmitter();
    this.appSubmit = new EventEmitter();
  }

  @ViewChild('canvasChart') canvasChart?: ElementRef;

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.drawChart();
  }

  onChangePrice() {
    if (!this.depositAmount) {
      const rate = Number(this.listingInfo?.minimum_deposit_rate);
      this.depositAmount = Number(this.bidAmount) * rate;
    }
  }

  onToggleChart(activeInterest: boolean) {
    this.activeInterestChart = activeInterest;
    this.drawChart();
  }

  onSimulate() {
    if (!this.classID || !this.nftID || !this.symbol) {
      alert('Invalid NFT Info!');
      return;
    }
    if (!this.bidAmount) {
      alert('Invalid Bid Price!');
      return;
    }
    if (!this.interestRate) {
      alert('Invalid Interest Rate!');
      return;
    }
    if (!this.date || !this.time) {
      alert('Invalid Expiration Date!');
      return;
    }
    const biddingPeriod = new Date(this.date + 'T' + this.time);
    this.appSimulate.emit({
      classID: this.classID,
      nftID: this.nftID,
      symbol: this.symbol,
      bidAmount: this.bidAmount,
      biddingPeriod: biddingPeriod,
      depositLendingRate: this.interestRate,
      autoPayment: this.autoPayment,
      depositAmount: 0,
    });
  }

  onSubmit() {
    if (!this.classID || !this.nftID) {
      return;
    }
    if (
      !this.symbol ||
      !this.depositAmount ||
      !this.bidAmount ||
      !this.date ||
      !this.time ||
      !this.interestRate
    ) {
      alert('Some values are invalid!');
      return;
    }
    const minExpiryDate = new Date();
    const expiryDate = new Date(this.date + 'T' + this.time);
    if (this.listingInfo && this.listingInfo.minimum_bidding_period) {
      const minExpirySeconds = parseInt(this.listingInfo.minimum_bidding_period);
      minExpiryDate.setSeconds(minExpiryDate.getSeconds() + minExpirySeconds);
    }
    if (expiryDate < minExpiryDate) {
      alert('Please set Expiration Date beyond the Minimum bidding period!');
      return;
    }
    this.appSubmit.emit({
      classID: this.classID,
      nftID: this.nftID,
      symbol: this.symbol,
      bidAmount: this.bidAmount,
      biddingPeriod: expiryDate,
      depositLendingRate: this.interestRate,
      autoPayment: this.autoPayment,
      depositAmount: this.depositAmount,
    });
  }

  calculateMinimumDeposit() {
    if (!this.bidAmount || !this.listingInfo?.minimum_deposit_rate) {
      this.minimumDeposit = 0;
      return;
    }
    const rate = Number(this.listingInfo.minimum_deposit_rate);
    this.minimumDeposit = this.bidAmount * rate;
  }

  drawChart() {
    this.contextChart = this.canvasChart?.nativeElement.getContext('2d');
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.contextChart && this.bids && this.listingInfo?.bid_denom) {
      if (this.activeInterestChart) {
        this.chart = this.pawnshopChart.createInterestDepositChart(
          this.contextChart,
          this.pawnshopChart.convertChartData(this.bids, this.listingInfo.bid_denom),
        );
      } else {
        this.chart = this.pawnshopChart.createExpiryDepositChart(
          this.contextChart,
          this.pawnshopChart.convertChartData(this.bids, this.listingInfo.bid_denom),
        );
      }
    }
  }
}
