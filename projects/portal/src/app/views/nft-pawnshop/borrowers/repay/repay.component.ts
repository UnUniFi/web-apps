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
import cosmosclient from '@cosmos-client/core';
import { ChartType } from 'angular-google-charts';
import { denomExponentMap } from 'projects/portal/src/app/models/cosmos/bank.model';
import { NftPawnshopChartService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.chart.service';
import { RepayRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { NftPawnshopService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.service';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import ununificlient from 'ununifi-client';
import {
  BidderBids200ResponseBidsInner,
  Liquidation200ResponseLiquidations,
  ListedNfts200ResponseListingsInnerListing,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-repay',
  templateUrl: './repay.component.html',
  styleUrls: ['./repay.component.css'],
})
export class RepayComponent implements OnInit, OnChanges {
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
  bids?: BidderBids200ResponseBidsInner[] | null;
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

  chartType: ChartType;
  chartTitle: string;
  chartColumns: any[];
  chartOptions: any;

  autoRepay = true;
  autoRepayBids: ununificlient.proto.ununifi.nftbackedloan.IBorrowBid[] = [];
  selectedBidder?: string;
  selectedBids: { address: string; amount: number }[] = [];

  @Output()
  appSubmit: EventEmitter<RepayRequest>;

  constructor(
    private readonly pawnshopChart: NftPawnshopChartService,
    private readonly nftPawnshopService: NftPawnshopService,
  ) {
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
    this.onChangeRepayAmount();
    const width: number = this.chartCardRef!.nativeElement.offsetWidth;
    this.chartOptions = this.pawnshopChart.createChartOption(width);
  }

  onToggleAuto(auto: boolean) {
    this.autoRepay = auto;
  }

  onChangeRepayAmount() {
    if (
      this.bids &&
      this.liquidation &&
      this.repayAmount &&
      this.symbol &&
      this.symbolMetadataMap
    ) {
      this.autoRepayBids = this.nftPawnshopService.autoRepayBids(
        this.bids,
        this.liquidation,
        this.repayAmount,
        this.symbol,
        this.symbolMetadataMap,
      );
      const exponent = denomExponentMap[this.listingInfo?.bid_token!];
      this.selectedBids = this.autoRepayBids.map((bid) => {
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
    if (this.autoRepay) {
      this.appSubmit.emit({
        classID: this.classID,
        nftID: this.nftID,
        repayBids: this.autoRepayBids,
      });
    } else {
      if (!this.symbol || !this.symbolMetadataMap) {
        alert('Invalid Token!');
        return;
      }
      const repayBids = this.nftPawnshopService.convertBorrowBids(
        this.selectedBids,
        this.symbol,
        this.symbolMetadataMap,
      );
      this.appSubmit.emit({
        classID: this.classID,
        nftID: this.nftID,
        repayBids,
      });
    }
  }
}
