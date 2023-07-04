import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ChartType } from 'angular-google-charts';
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

  date?: string;
  time?: string;
  minimumDeposit: number = 0;
  autoPayment: boolean = true;

  chartType: ChartType;
  chartTitle: string;
  chartColumns: any[];
  chartOptions: any;

  @Output()
  appSimulate: EventEmitter<PlaceBidRequest>;
  @Output()
  appSubmit: EventEmitter<PlaceBidRequest>;

  constructor(private readonly pawnshopChart: NftPawnshopChartService) {
    const now = new Date();
    // set expire in 1 year
    now.setFullYear(now.getFullYear() + 1);
    this.date =
      now.getFullYear() +
      '-' +
      ('0' + (now.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + now.getDate()).slice(-2);
    this.time = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
    this.chartTitle = '';
    this.chartType = ChartType.BarChart;
    const width: number = this.chartCardRef?.nativeElement.offsetWidth || 320;
    this.chartOptions = this.pawnshopChart.createChartOption(width);
    this.chartColumns = [
      { type: 'string', label: 'Expiry Date' },
      { type: 'number', label: 'Existing Bid' },
      { type: 'string', role: 'style' },
      { type: 'string', role: 'annotation' },
    ];
    this.appSimulate = new EventEmitter();
    this.appSubmit = new EventEmitter();
  }

  @ViewChild('chartCardRef') chartCardRef?: ElementRef;
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    const width: number = this.chartCardRef!.nativeElement.offsetWidth;
    this.chartOptions = this.pawnshopChart.createChartOption(width);
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    const width: number = this.chartCardRef!.nativeElement.offsetWidth;
    this.chartOptions = this.pawnshopChart.createChartOption(width);
  }

  onSimulate() {
    console.log(this.date);
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
    const biddingPeriod = new Date(this.date + 'T' + this.time);
    if (biddingPeriod < new Date()) {
      alert('Bidding period should be in the future!');
      return;
    }
    this.appSubmit.emit({
      classID: this.classID,
      nftID: this.nftID,
      symbol: this.symbol,
      bidAmount: this.bidAmount,
      biddingPeriod: biddingPeriod,
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
}
