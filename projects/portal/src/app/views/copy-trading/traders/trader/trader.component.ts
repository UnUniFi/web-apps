import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CreateTracingRequest,
  UpdateExemplaryTraderRequest,
} from 'projects/portal/src/app/models/copy-trading/copy-trading.model';
import {
  ExemplaryTraderAll200ResponseExemplaryTraderInner,
  ExemplaryTraderTracing200ResponseTracingInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-trader',
  templateUrl: './trader.component.html',
  styleUrls: ['./trader.component.css'],
})
export class TraderComponent implements OnInit {
  @Input() address?: string | null;
  @Input() exemplaryTraderAddress?: string | null;
  @Input() trader?: ExemplaryTraderAll200ResponseExemplaryTraderInner | null;
  @Input() tracing?: ExemplaryTraderTracing200ResponseTracingInner | null;
  @Input() isTracing?: boolean | null;
  @Input() userCount?: number | null;
  @Input() commissionRate?: number | null;
  @Input() description?: string | null;
  @Output() createTracing = new EventEmitter<CreateTracingRequest>();
  @Output() deleteTracing = new EventEmitter<{}>();
  @Output() updateTrader = new EventEmitter<UpdateExemplaryTraderRequest>();
  @Output() deleteTrader = new EventEmitter<{}>();

  sizeCoef: number = 1;
  leverageCoef: number = 1;
  isReverse: boolean = false;
  newRate?: number;

  constructor() {}

  ngOnInit(): void {}

  onClickCreateTracing() {
    if (!this.exemplaryTraderAddress) {
      return;
    }
    this.createTracing.emit({
      exemplaryTrader: this.exemplaryTraderAddress,
      sizeCoef: this.sizeCoef,
      leverageCoef: this.leverageCoef,
      reverse: this.isReverse,
    });
  }

  onClickDeleteTracing() {
    this.deleteTracing.emit();
  }

  onClickUpdateTrader() {
    if (this.newRate === undefined) {
      return;
    }
    this.updateTrader.emit({
      name: this.trader?.name || '',
      description: this.description || '',
      profitCommissionRate: this.newRate,
    });
  }

  onClickDeleteTrader() {
    this.deleteTrader.emit();
  }
}
