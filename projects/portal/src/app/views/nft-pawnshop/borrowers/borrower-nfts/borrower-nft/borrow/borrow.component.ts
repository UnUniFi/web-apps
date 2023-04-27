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
import { BorrowRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import {
  ListedNfts200ResponseListingsInnerListing,
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
  listingInfo?: ListedNfts200ResponseListingsInnerListing | null;
  @Input()
  symbol?: string | null;
  @Input()
  symbolImage?: string | null;
  @Input()
  bidders?: BidderBids200ResponseBidsInner[] | null;
  @Input()
  loans?: Loans200ResponseLoansInner[] | null;
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
  @Input()
  shortestExpiryDate?: Date | null;
  @Input()
  averageInterestRate?: number | null;

  borrowDenom?: string;
  chartType: ChartType;
  chartTitle: string;
  chartColumns: any[];
  chartOptions: any;

  @Output()
  appSimulate: EventEmitter<BorrowRequest>;
  @Output()
  appSubmit: EventEmitter<BorrowRequest>;

  constructor(private readonly pawnshopChart: NftPawnshopChartService) {
    this.borrowDenom = 'GUU';
    this.chartTitle = '';
    this.chartType = ChartType.BarChart;
    const width: number = this.chartCardRef?.nativeElement.offsetWidth || 320;
    this.chartOptions = this.pawnshopChart.createChartOption(width);

    this.chartColumns = [
      { type: 'string', label: 'Expiry Date' },
      { type: 'number', label: 'Deposit Amount' },
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
    if (!this.selectedBorrowAmount || !this.borrowDenom) {
      alert('Some values are invalid!');
      return;
    }
    this.appSimulate.emit({
      classID: this.classID,
      nftID: this.nftID,
      symbol: this.borrowDenom,
      amount: this.selectedBorrowAmount,
    });
  }

  onSubmit() {
    if (!this.classID || !this.nftID) {
      return;
    }
    if (!this.selectedBorrowAmount || !this.borrowDenom) {
      alert('Some values are invalid!');
      return;
    }
    this.appSubmit.emit({
      classID: this.classID,
      nftID: this.nftID,
      symbol: this.borrowDenom,
      amount: this.selectedBorrowAmount,
    });
  }
}
