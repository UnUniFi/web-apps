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
import { cosmos } from '@cosmos-client/core/esm/proto';
import { ChartType } from 'angular-google-charts';
import { YieldAggregatorChartService } from 'projects/portal/src/app/models/ununifi/yield-aggregator.chart.service';
import {
  DepositToVaultRequest,
  WithdrawFromVaultRequest,
} from 'projects/portal/src/app/models/ununifi/yield-aggregator.model';
import {
  StrategyAll200ResponseStrategiesInner,
  Vault200Response,
  VaultAll200ResponseVaultsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
})
export class VaultComponent implements OnInit {
  @Input()
  vault?: Vault200Response | null;
  @Input()
  symbol?: string | null;
  @Input()
  symbolImage?: string | null;
  @Input()
  symbolBalancesMap?: { [symbol: string]: number } | null;
  @Input()
  symbolMetadataMap?: { [symbol: string]: cosmos.bank.v1beta1.IMetadata } | null;
  @Output()
  changeDeposit: EventEmitter<number>;
  @Output()
  appDeposit: EventEmitter<DepositToVaultRequest>;
  @Output()
  changeWithdraw: EventEmitter<number>;
  @Output()
  appWithdraw: EventEmitter<WithdrawFromVaultRequest>;

  mintAmount?: number;
  burnAmount?: number;
  chartType: ChartType;
  chartTitle: string;
  chartData: any[];
  chartColumnNames: any[];
  chartOptions: any;
  tab: 'mint' | 'burn' = 'mint';

  constructor(private readonly iyaChart: YieldAggregatorChartService) {
    this.changeDeposit = new EventEmitter();
    this.appDeposit = new EventEmitter();
    this.changeWithdraw = new EventEmitter();
    this.appWithdraw = new EventEmitter();
    this.chartTitle = '';
    this.chartType = ChartType.LineChart;
    const width: number = this.chartRef?.nativeElement.offsetWidth || 480;
    this.chartOptions = this.iyaChart.createChartOption(width);

    this.chartData = this.iyaChart.createDummyChartData();
    this.chartColumnNames = ['Date', 'APY'];
  }

  @ViewChild('chartRef') chartRef?: ElementRef;
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    const width: number = this.chartRef!.nativeElement.offsetWidth;
    this.chartOptions = this.iyaChart.createChartOption(width >= 960 ? width / 2 : width);
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    const width: number = this.chartRef!.nativeElement.offsetWidth;
    this.chartOptions = this.iyaChart.createChartOption(width >= 960 ? width / 2 : width);
  }

  onDepositAmountChange() {
    this.changeDeposit.emit(this.mintAmount);
  }

  onSubmitDeposit() {
    if (!this.mintAmount) {
      return;
    }
    this.appDeposit.emit({
      vaultId: this.vault?.vault?.id!,
      amount: this.mintAmount,
      symbol: this.symbol!,
    });
  }

  onWithdrawAmountChange() {
    this.changeWithdraw.emit(this.burnAmount);
  }

  onSubmitWithdraw() {
    if (!this.burnAmount) {
      return;
    }
    this.appWithdraw.emit({
      vaultId: this.vault?.vault?.id!,
      amount: this.burnAmount,
      symbol: this.symbol!,
    });
  }

  getStrategyInfo(id?: string): StrategyAll200ResponseStrategiesInner | undefined {
    return this.vault?.strategies?.find((strategy) => strategy.id === id);
  }
}
