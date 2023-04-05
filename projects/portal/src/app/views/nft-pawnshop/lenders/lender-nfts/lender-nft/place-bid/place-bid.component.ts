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
import { NftPawnshopPocService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.poc.service';
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
  listingInfo?: ListedNfts200ResponseListingsInnerListing | null;
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
  minimumDeposit: number;
  interestRate?: number | null;
  datePicker?: Date | null;
  date?: string;
  time?: string;
  autoPayment?: boolean;
  within3Days?: boolean;

  chartType: ChartType;
  chartTitle: string;
  chartColumns: any[];
  chartOptions: any;

  @Output()
  appSimulate: EventEmitter<PlaceBidRequest>;
  @Output()
  appSubmit: EventEmitter<PlaceBidRequest>;

  constructor(
    private readonly pawnshopChart: NftPawnshopChartService,
    private readonly pawnshopPoc: NftPawnshopPocService,
  ) {
    const lendAmount = localStorage.getItem('lendAmount');
    this.depositAmount = lendAmount ? Number(lendAmount) : null;
    this.depositSymbol = localStorage.getItem('lendSymbol');
    const lendRate = localStorage.getItem('lendRate');
    this.interestRate = lendRate ? Number(lendRate) : null;
    const lendTerm = localStorage.getItem('lendTerm');
    this.datePicker = lendTerm ? new Date(lendTerm) : null;
    if (this.datePicker) {
      this.date =
        this.datePicker.getFullYear().toString().padStart(4, '0') +
        '-' +
        (this.datePicker.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        this.datePicker.getDate().toString().padStart(2, '0');
      this.time =
        this.datePicker.getHours().toString().padStart(2, '0') +
        ':' +
        this.datePicker.getDate().toString().padStart(2, '0');
    }
    this.autoPayment = true;
    const now = new Date();
    now.setDate(now.getDate() + 3);
    this.within3Days = this.datePicker ? this.datePicker < now : false;

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
    this.minimumDeposit = 0;
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

  onChangeDate() {
    console.log(this.date, this.time);
    const biddingPeriod = new Date(this.date + 'T' + this.time);
    const now = new Date();
    console.log(biddingPeriod);
    now.setDate(now.getDate() + 3);
    this.within3Days = biddingPeriod < now;
  }

  getPocValue() {
    if (this.currentStoredWallet && this.classID && this.nftID) {
      return this.pawnshopPoc.getPocValue(
        this.currentStoredWallet?.address,
        this.classID,
        this.nftID,
      );
    } else {
      return '0GUU';
    }
  }

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

  calculateMinimumDeposit() {
    if (!this.bidAmount || !this.listingInfo?.minimum_deposit_rate) {
      this.minimumDeposit = 0;
      return;
    }
    const rate = Number(this.listingInfo.minimum_deposit_rate);
    this.minimumDeposit = this.bidAmount * rate;
  }
}
