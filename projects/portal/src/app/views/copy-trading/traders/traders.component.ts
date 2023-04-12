import { Component, Input, OnInit } from '@angular/core';
import {
  ExemplaryTraderAll200ResponseExemplaryTraderInner,
  ExemplaryTraderTracing200ResponseTracingInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-traders',
  templateUrl: './traders.component.html',
  styleUrls: ['./traders.component.css'],
})
export class TradersComponent implements OnInit {
  @Input() address?: string | null;
  @Input() tracing?: ExemplaryTraderTracing200ResponseTracingInner | null;
  @Input() exemplaryTraders?: ExemplaryTraderAll200ResponseExemplaryTraderInner[] | null;
  @Input() availableTracings?: ExemplaryTraderTracing200ResponseTracingInner[] | null;

  constructor() {}

  ngOnInit(): void {}
}
