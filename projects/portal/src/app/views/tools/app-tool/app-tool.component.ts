import { AppNavigation } from '../../../models/config.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'view-app-tool',
  templateUrl: './app-tool.component.html',
  styleUrls: ['./app-tool.component.css'],
})
export class AppToolComponent implements OnInit {
  @Input()
  apps?: AppNavigation[] | null;
  @Input()
  selectedApp?: AppNavigation | null;

  constructor() {}

  ngOnInit(): void {}
}
