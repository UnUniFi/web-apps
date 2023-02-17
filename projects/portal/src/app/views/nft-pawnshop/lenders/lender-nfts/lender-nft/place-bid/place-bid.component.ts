import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
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
  ListedNfts200ResponseListingsInner,
  BidderBids200ResponseBidsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-place-bid',
  templateUrl: './place-bid.component.html',
  styleUrls: ['./place-bid.component.css'],
})
export class PlaceBidComponent implements OnInit {
  @Input()
  classID?: string | null;
  @Input()
  nftID?: string | null;
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  balance?: number | null;
  @Input()
  listingInfo?: ListedNfts200ResponseListingsInner | null;
  @Input()
  bidders?: BidderBids200ResponseBidsInner[] | null;
  @Input()
  nftMetadata?: Metadata | null;
  @Input()
  nftImage?: string | null;
  @Input()
  chartData?: (string | number)[][] | null;

  bidAmount?: number | null;
  depositAmount?: number | null;
  depositSymbol?: string | null;
  interestRate?: number | null;
  datePicker?: Date | null;
  date?: string;
  time?: string;
  autoPayment?: boolean;

  chartType: ChartType;
  chartTitle: string;
  chartColumns: any[];
  chartOptions: any;

  @Output()
  appSimulate: EventEmitter<PlaceBidRequest>;
  @Output()
  appSubmit: EventEmitter<PlaceBidRequest>;

  constructor(private readonly pawnshopChart: NftPawnshopChartService) {
    const lendAmount = localStorage.getItem('lendAmount');
    this.depositAmount = lendAmount ? Number(lendAmount) : null;
    this.depositSymbol = localStorage.getItem('lendSymbol');
    const lendRate = localStorage.getItem('lendRate');
    this.interestRate = lendRate ? Number(lendRate) : null;
    const lendTerm = localStorage.getItem('lendTerm');
    this.datePicker = lendTerm ? new Date(lendTerm) : null;
    const dateString = this.datePicker?.toISOString();
    if (dateString) {
      this.date = dateString.substring(0, dateString.indexOf('T'));
      this.time = dateString.substring(dateString.indexOf('T') + 1, dateString.indexOf('T') + 6);
    }
    this.autoPayment = true;

    this.chartTitle = '';
    this.chartType = ChartType.BarChart;
    const width: number = this.chartCardRef?.nativeElement.offsetWidth || 640;
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

  onSimulate() {
    if (!this.classID || !this.nftID) {
      return;
    }
    if (!this.depositSymbol || !this.bidAmount || !this.date || !this.time || !this.interestRate) {
      alert('Some values are invalid!');
      return;
    }
    const biddingPeriod = new Date(this.date + 'T' + this.time);
    this.appSimulate.emit({
      classID: this.classID,
      nftID: this.nftID,
      symbol: this.depositSymbol,
      bidAmount: this.bidAmount,
      biddingPeriod: biddingPeriod,
      depositLendingRate: this.interestRate,
      autoPayment: this.autoPayment || false,
      depositAmount: 0,
    });
  }

  onSubmit() {
    if (!this.classID || !this.nftID) {
      return;
    }
    if (
      !this.depositSymbol ||
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
    this.appSubmit.emit({
      classID: this.classID,
      nftID: this.nftID,
      symbol: this.depositSymbol,
      bidAmount: this.bidAmount,
      biddingPeriod: biddingPeriod,
      depositLendingRate: this.interestRate,
      autoPayment: this.autoPayment || false,
      depositAmount: this.depositAmount,
    });
  }

  toSimpleString(date: Date) {
    return (
      [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/') +
      ' ' +
      date.toLocaleTimeString()
    );
  }
}
