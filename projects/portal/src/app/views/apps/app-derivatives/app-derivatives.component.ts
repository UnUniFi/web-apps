import { apps } from '../../tools/app-tool/app-tool.component';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'view-app-derivatives',
  templateUrl: './app-derivatives.component.html',
  styleUrls: ['./app-derivatives.component.css'],
})
export class AppDerivativesComponent implements OnInit {
  @Input()
  navigations?: { name: string; link: string; icon: string }[] | null;

  apps: { name: string; link: string; icon: string }[];

  constructor() {
    this.apps = apps;
  }

  ngOnInit(): void {}
}
