import { AppNavigation } from '../../../models/config.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'view-app-derivatives',
  templateUrl: './app-derivatives.component.html',
  styleUrls: ['./app-derivatives.component.css'],
})
export class AppDerivativesComponent implements OnInit {
  @Input()
  navigations?: { name: string; link: string; icon: string }[] | null;
  @Input()
  apps?: AppNavigation[] | null;

  constructor() {}

  ngOnInit(): void {}
}
