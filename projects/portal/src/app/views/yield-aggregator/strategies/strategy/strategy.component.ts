import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { YieldAggregatorChartService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.chart.service';
import {
  StrategyAll200ResponseStrategiesInner,
  VaultAll200ResponseVaultsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.css'],
})
export class StrategyComponent implements OnInit, OnChanges {
  @Input()
  strategy?: any | null;
  // TODO: fix this
  // strategy?: StrategyAll200ResponseStrategiesInner | null;
  @Input()
  id?: string | null;
  @Input()
  symbol?: string | null;
  @Input()
  symbolImage?: string | null;
  @Input()
  vaults?: VaultAll200ResponseVaultsInner[] | null;
  @Input()
  weights?: (string | undefined)[] | null;

  description: string;
  chartType: ChartType;
  chartTitle: string;
  chartData: any[];
  chartColumnNames: any[];
  chartOptions: any;

  constructor(private readonly iyaChart: YieldAggregatorChartService) {
    this.description =
      'Supplies and borrows USDC on Compound Finance simultaneously to earn COMP. Flashmints are used to mint DAI from MakerDAO to flashlend and fold the position, boosting the APY. Earned tokens are harvested, sold for more USDC which is deposited back into the strategy. \nLast report 7 days ago.';
    this.chartTitle = '';
    this.chartType = ChartType.LineChart;
    this.chartData = this.iyaChart.createDummyChartData();
    this.chartColumnNames = ['Date', 'APR'];
    const width: number = this.cardRef?.nativeElement.offsetWidth || 480;
    this.chartOptions = this.iyaChart.createChartOption(width >= 960 ? width / 2 : width);
  }

  @ViewChild('chartRef') cardRef?: ElementRef;
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    const width: number = this.cardRef!.nativeElement.offsetWidth;
    this.chartOptions = this.iyaChart.createChartOption(width >= 960 ? width / 2 : width);
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    const width: number = this.cardRef!.nativeElement.offsetWidth;
    console.log(width);
    this.chartOptions = this.iyaChart.createChartOption(width >= 960 ? width / 2 : width);
  }
}
