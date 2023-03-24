import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { VaultAll200ResponseVaultsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
})
export class VaultComponent implements OnInit {
  @Input()
  vault?: VaultAll200ResponseVaultsInner | null;

  amount: string;
  assets: string[];
  selectedAsset: string;
  isDeposit: boolean;
  chartType: ChartType;
  chartTitle: string;
  chartData: any[];
  chartColumnNames: any[];
  chartOptions: any;
  configs: string[];
  selectedConfig: string;
  tab: 'mint' | 'burn' = 'mint';

  constructor() {
    this.vault = {
      id: '1',
      denom: 'uusdc',
      owner: 'ununifi155u042u8wk3al32h3vzxu989jj76k4zcu44v6w',
      owner_deposit: { amount: '1000000', denom: 'uusdc' },
      withdraw_commission_rate: '0.02',
      withdraw_reserve_rate: '0.015',
      strategy_weights: [
        { strategy_id: 'st01', weight: '0.6' },
        { strategy_id: 'st02', weight: '0.4' },
      ],
    };
    this.amount = '0';
    this.assets = ['atom'];
    this.selectedAsset = this.assets[0];
    this.configs = ['APY'];
    this.selectedConfig = this.configs[0];
    this.isDeposit = true;
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
    this.chartColumnNames = ['Date', 'APY'];
  }

  @ViewChild('chartCardRef') chartCardRef?: ElementRef;
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    const width: number = this.chartCardRef!.nativeElement.offsetWidth;
    this.chartOptions = this.createChartOption(width);
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    const width: number = this.chartCardRef!.nativeElement.offsetWidth;
    this.chartOptions = this.createChartOption(width);
  }

  onToggleChange(value: string): void {
    if (value == 'deposit') {
      this.isDeposit = true;
    }
    if (value == 'withdraw') {
      this.isDeposit = false;
    }
  }

  onChangeConfig(config: string) {
    this.selectedConfig = config;
  }

  createChartOption(width: number) {
    return {
      width: width,
      height: width / 2,
      backgroundColor: 'none',
      colors: ['pink'],
      lineWidth: 4,
      pointSize: 6,
      legend: {
        position: 'bottom',
        textStyle: {
          color: 'white',
          fontSize: 14,
          bold: true,
        },
      },
      hAxis: {
        textStyle: {
          color: 'white',
          fontSize: 14,
        },
      },
      vAxis: {
        textStyle: {
          color: 'white',
          fontSize: 14,
        },
        baseline: 0,
        baselineColor: 'white',
        gridlines: { color: 'grey', count: -1 },
      },
      Animation: { duration: 1000, startup: true },
    };
  }
}
