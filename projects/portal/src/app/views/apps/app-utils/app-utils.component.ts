import { AppNavigation } from '../../../models/config.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'view-app-utils',
  templateUrl: './app-utils.component.html',
  styleUrls: ['./app-utils.component.css'],
})
export class AppUtilsComponent implements OnInit {
  @Input()
  navigations?: { name: string; link: string; icon: string }[] | null;
  @Input()
  apps?: AppNavigation[] | null;

  constructor() {}

  ngOnInit(): void {}
}
