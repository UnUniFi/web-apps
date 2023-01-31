import { VaultInfo } from '../vaults.component';
import { Component, HostListener, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'view-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
})
export class VaultComponent implements OnInit {
  vault: VaultInfo;
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

  constructor() {
    this.amount = '0';
    this.assets = ['atom'];
    this.selectedAsset = this.assets[0];
    this.configs = ['APY'];
    this.selectedConfig = this.configs[0];
    this.isDeposit = true;
    this.vault = {
      name: 'Cosmos',
      symbol: 'atom',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/atom.svg',
      annualPercentageYield: '0.03',
      totalValueLocked: '100000',
      availableAmount: '20000',
      depositedAmount: '0',
      earnedAmount: '0',
      coinType: 'ATOM',
      description:
        'Cosmos (ATOM) is a cryptocurrency that powers an ecosystem of blockchains designed to scale and interoperate with each other. The team aims to "create an Internet of Blockchains, a network of blockchains able to communicate with each other in a decentralized way." Cosmos is a proof-of-stake chain. ATOM holders can stake their tokens in order to maintain the network and receive more ATOM as a reward.',
    };
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
    this.chartOptions = this.createChartOption();
  }

  ngOnInit(): void {}

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

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.chartOptions = this.createChartOption();
  }

  createChartOption() {
    const innerWidth = window.innerWidth;
    let width: number;
    if (innerWidth < 640) {
      width = innerWidth;
    } else if (innerWidth > 1440) {
      width = 1000;
    } else if (innerWidth > 1024) {
      width = 800;
    } else {
      width = (innerWidth * 2) / 3;
    }
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
