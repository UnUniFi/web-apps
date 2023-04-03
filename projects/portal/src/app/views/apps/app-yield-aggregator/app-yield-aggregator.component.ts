import { apps } from '../../tools/app-tool/app-tool.component';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'view-app-yield-aggregator',
  templateUrl: './app-yield-aggregator.component.html',
  styleUrls: ['./app-yield-aggregator.component.css'],
})
export class AppYieldAggregatorComponent implements OnInit {
  @Input()
  navigations?: { name: string; link: string; icon: string }[] | null;

  apps: { name: string; link: string; icon: string }[];

  constructor() {
    this.apps = apps;
  }

  ngOnInit(): void {}
}
