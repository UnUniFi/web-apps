import { apps } from '../../tools/app-tool/app-tool.component';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'view-app-utils',
  templateUrl: './app-utils.component.html',
  styleUrls: ['./app-utils.component.css'],
})
export class AppUtilsComponent implements OnInit {
  @Input()
  navigations?: { name: string; link: string; icon: string }[] | null;
  apps: { name: string; link: string; icon: string }[];

  constructor() {
    // Disable apps for now
    this.apps = [];
    // this.apps = apps;
  }

  ngOnInit(): void {}
}
