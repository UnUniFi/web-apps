import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChartType } from 'angular-google-charts';
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
  listingInfo?: ListedNfts200ResponseListingsInner | null;
  @Input()
  bidders?: BidderBids200ResponseBidsInner[] | null;
  @Input()
  nftMetadata?: Metadata | null;
  @Input()
  nftImage?: string | null;
  @Input()
  chartData?: (string | number | Date)[][] | null;

  bidAmount?: number | null;
  depositAmount?: number | null;
  depositDenom?: string | null;
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

  constructor() {
    const lendAmount = localStorage.getItem('lendAmount');
    this.depositAmount = lendAmount ? Number(lendAmount) : null;
    this.depositDenom = localStorage.getItem('lendDenom');
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
    this.chartOptions = this.createChartOption();
    this.chartColumns = [
      { type: 'string', label: 'Expiry Date' },
      { type: 'number', label: 'Bid Amount' },
      { type: 'string', role: 'style' },
      { type: 'string', role: 'annotation' },
    ];

    this.appSimulate = new EventEmitter();
    this.appSubmit = new EventEmitter();
  }

  ngOnInit(): void {}

  onSimulate() {
    if (!this.classID || !this.nftID) {
      return;
    }
    if (!this.depositDenom || !this.bidAmount || !this.date || !this.time || !this.interestRate) {
      alert('Some values are invalid!');
      return;
    }
    const biddingPeriod = new Date(this.date + 'T' + this.time);
    this.appSimulate.emit({
      classID: this.classID,
      nftID: this.nftID,
      symbol: this.depositDenom,
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
      !this.depositDenom ||
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
      symbol: this.depositDenom,
      bidAmount: this.bidAmount,
      biddingPeriod: biddingPeriod,
      depositLendingRate: this.interestRate,
      autoPayment: this.autoPayment || false,
      depositAmount: this.depositAmount,
    });
  }

  createChartOption() {
    const innerWidth = window.innerWidth;
    let width: number;
    if (innerWidth < 640) {
      width = innerWidth;
    } else if (innerWidth > 1440) {
      width = 500;
    } else if (innerWidth > 1024) {
      width = 400;
    } else {
      width = innerWidth / 3;
    }
    return {
      width: width,
      height: width / 2,
      backgroundColor: 'none',
      // colors: ['pink'],
      lineWidth: 4,
      pointSize: 6,
      legend: {
        position: 'bottom',
        textStyle: {
          color: 'black',
          fontSize: 14,
          bold: true,
        },
      },
      hAxis: {
        textStyle: {
          color: 'black',
          fontSize: 14,
        },
      },
      vAxis: {
        textStyle: {
          color: 'black',
          fontSize: 14,
        },
        baseline: 0,
        baselineColor: 'black',
        gridlines: { color: 'grey', count: -1 },
      },
      bar: { groupWidth: '75%' },
      annotations: {
        alwaysOutside: true,
        highContrast: false,
        stem: {
          color: 'black',
          length: 0,
        },
        textStyle: {
          fontSize: 14,
          bold: true,
          color: 'black',
          opacity: 0.8,
        },
      },
      Animation: { duration: 1000, startup: true },
    };
  }

  toSimpleString(date: Date) {
    return (
      [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/') +
      ' ' +
      date.toLocaleTimeString()
    );
  }
}
