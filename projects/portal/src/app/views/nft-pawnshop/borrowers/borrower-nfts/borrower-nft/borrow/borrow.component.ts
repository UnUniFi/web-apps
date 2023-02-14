import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { NftPawnshopChartService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.chart.service';
import { BorrowRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import {
  ListedNfts200ResponseListingsInner,
  BidderBids200ResponseBidsInner,
  Loans200ResponseLoansInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.css'],
})
export class BorrowComponent implements OnInit {
  @Input()
  classID?: string | null;
  @Input()
  nftID?: string | null;
  @Input()
  listingInfo?: ListedNfts200ResponseListingsInner | null;
  @Input()
  bidders?: BidderBids200ResponseBidsInner[] | null;
  @Input()
  loans?: Loans200ResponseLoansInner[] | null;
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

  borrowAmount?: number;
  chartType: ChartType;
  chartTitle: string;
  chartColumns: any[];
  chartOptions: any;

  @Output()
  appSimulate: EventEmitter<BorrowRequest>;
  @Output()
  appSubmit: EventEmitter<BorrowRequest>;

  constructor(private readonly pawnshopChart: NftPawnshopChartService) {
    this.chartTitle = '';
    this.chartType = ChartType.BarChart;
    this.chartOptions = this.pawnshopChart.createChartOption();
    this.chartColumns = [
      { type: 'string', label: 'Expiry Date' },
      { type: 'number', label: 'Deposit Amount' },
      { type: 'string', role: 'style' },
      { type: 'string', role: 'annotation' },
    ];
    this.appSimulate = new EventEmitter();
    this.appSubmit = new EventEmitter();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.chartOptions = this.pawnshopChart.createChartOption();
  }

  ngOnInit(): void {}

  onSimulate() {
    this.appSimulate.emit();
  }

  onSubmit() {
    this.appSubmit.emit();
  }
}
