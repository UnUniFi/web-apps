import { Component, Input, OnInit } from '@angular/core';
import { StrategyAll200ResponseStrategiesInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-strategies',
  templateUrl: './strategies.component.html',
  styleUrls: ['./strategies.component.css'],
})
export class StrategiesComponent implements OnInit {
  @Input()
  strategies?: StrategyAll200ResponseStrategiesInner[] | null;

  constructor() {}

  ngOnInit(): void {}
}
