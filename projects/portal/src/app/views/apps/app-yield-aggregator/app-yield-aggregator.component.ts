import { AppNavigation } from '../../../models/config.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'view-app-yield-aggregator',
  templateUrl: './app-yield-aggregator.component.html',
  styleUrls: ['./app-yield-aggregator.component.css'],
})
export class AppYieldAggregatorComponent implements OnInit {
  @Input()
  navigations?: { name: string; link: string; icon: string }[] | null;
  @Input()
  apps?: AppNavigation[] | null;
  @Input()
  address?: string | null;

  constructor() {}

  ngOnInit(): void {}
}
