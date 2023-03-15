import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'view-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.css'],
})
export class StrategyComponent implements OnInit {
  description: string;
  chartType: ChartType;
  chartTitle: string;
  chartData: any[];
  chartColumnNames: any[];
  chartOptions: any;

  constructor() {
    this.description =
      'Supplies and borrows USDC on Compound Finance simultaneously to earn COMP. Flashmints are used to mint DAI from MakerDAO to flashlend and fold the position, boosting the APY. Earned tokens are harvested, sold for more USDC which is deposited back into the strategy. \nLast report 7 days ago.';
    this.chartTitle = '';
    this.chartType = ChartType.LineChart;
    const now = new Date();
    const day1 = new Date(2023, 0, 1);
    const day2 = new Date(2023, 0, 15);
    this.chartData = [
      [day1.toLocaleDateString(), 1.0],
      [day2.toLocaleDateString(), 1.4],
      [now.toLocaleDateString(), 1.6],
    ];
    this.chartColumnNames = ['Date', 'APR'];
    const width: number = this.cardRef?.nativeElement.offsetWidth || 640;
    this.chartOptions = this.createChartOption(width);
  }

  @ViewChild('cardRef') cardRef?: ElementRef;
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    const width: number = this.cardRef!.nativeElement.offsetWidth;
    this.chartOptions = this.createChartOption(width);
  }
  ngOnInit(): void {}
  ngOnChanges(): void {
    const width: number = this.cardRef!.nativeElement.offsetWidth;
    console.log(width);
    this.chartOptions = this.createChartOption(width);
  }

  createChartOption(width: number) {
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
          color: 'grey',
          fontSize: 14,
          bold: true,
        },
      },
      hAxis: {
        textStyle: {
          color: 'grey',
          fontSize: 14,
        },
      },
      vAxis: {
        textStyle: {
          color: 'grey',
          fontSize: 14,
        },
        baseline: 0,
        baselineColor: 'grey',
        gridlines: { color: 'grey', count: -1 },
      },
      Animation: { duration: 1000, startup: true },
    };
  }
}
