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
import { RepayRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import {
  BidderBids200ResponseBidsInner,
  Loans200ResponseLoansInner,
  Liquidation200ResponseLiquidations,
  ListedNfts200ResponseListingsInnerListing,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-repay',
  templateUrl: './repay.component.html',
  styleUrls: ['./repay.component.css'],
})
export class RepayComponent implements OnInit {
  @Input()
  classID?: string | null;
  @Input()
  nftID?: string | null;
  @Input()
  listingInfo?: ListedNfts200ResponseListingsInnerListing | null;
  @Input()
  bidders?: BidderBids200ResponseBidsInner[] | null;
  @Input()
  loans?: Loans200ResponseLoansInner[] | null;
  @Input()
  liquidation?: Liquidation200ResponseLiquidations | null;
  @Input()
  repayAmount?: number | null;
  @Input()
  nftMetadata?: Metadata | null;
  @Input()
  nftImage?: string | null;
  @Input()
  chartData?: (string | number)[][] | null;
  @Input()
  shortestExpiryDate?: Date | null;
  @Input()
  averageInterestRate?: number | null;

  repayDenom?: string;
  chartType: ChartType;
  chartTitle: string;
  chartColumns: any[];
  chartOptions: any;

  @Output()
  appSimulate: EventEmitter<RepayRequest>;
  @Output()
  appSubmit: EventEmitter<RepayRequest>;

  constructor(private readonly pawnshopChart: NftPawnshopChartService) {
    this.repayDenom = 'GUU';
    this.chartTitle = '';
    this.chartType = ChartType.BarChart;
    const width: number = this.chartCardRef?.nativeElement.offsetWidth || 320;
    this.chartOptions = this.pawnshopChart.createChartOption(width);
    this.chartColumns = [
      { type: 'string', label: 'Expiry Date' },
      { type: 'number', label: 'Borrowing Amount' },
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
    if (!this.classID || !this.nftID) {
      return;
    }
    if (!this.repayAmount || !this.repayDenom) {
      alert('Some values are invalid!');
      return;
    }
    this.appSimulate.emit({
      classID: this.classID,
      nftID: this.nftID,
      symbol: this.repayDenom,
      amount: this.repayAmount,
    });
  }

  onSubmit() {
    if (!this.classID || !this.nftID) {
      return;
    }
    if (!this.repayAmount || !this.repayDenom) {
      alert('Some values are invalid!');
      return;
    }
    this.appSubmit.emit({
      classID: this.classID,
      nftID: this.nftID,
      symbol: this.repayDenom,
      amount: this.repayAmount,
    });
  }
}
