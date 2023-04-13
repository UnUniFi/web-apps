import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CreateExemplaryTraderRequest,
  UpdateExemplaryTraderRequest,
} from 'projects/portal/src/app/models/copy-trading/copy-trading.model';
import { ExemplaryTraderAll200ResponseExemplaryTraderInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  @Input() address?: string | null;
  @Input() myExemplaryTrader?: ExemplaryTraderAll200ResponseExemplaryTraderInner | null;
  @Input() traderName?: string | null;
  @Input() traderDescription?: string | null;
  @Input() commissionRate?: number | null;
  @Input() newCommissionRate?: number | null;
  @Output() createExemplaryTrader = new EventEmitter<CreateExemplaryTraderRequest>();
  @Output() updateExemplaryTrader = new EventEmitter<UpdateExemplaryTraderRequest>();
  constructor() {}

  ngOnInit(): void {}

  onClickButton() {
    if (!this.traderName || !this.traderDescription || !this.newCommissionRate) {
      alert('Please fill all fields.');
      return;
    }
    if (this.myExemplaryTrader) {
      this.updateExemplaryTrader.emit({
        name: this.traderName,
        description: this.traderDescription,
        profitCommissionRate: this.newCommissionRate,
      });
    } else {
      this.createExemplaryTrader.emit({
        name: this.traderName,
        description: this.traderDescription,
        profitCommissionRate: this.newCommissionRate,
      });
    }
  }
}
