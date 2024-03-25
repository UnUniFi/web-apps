import { AppNavigation } from '../../../models/config.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'view-app-interest-rate-swap',
  templateUrl: './app-interest-rate-swap.component.html',
  styleUrls: ['./app-interest-rate-swap.component.css'],
})
export class AppInterestRateSwapComponent implements OnInit {
  @Input()
  navigations?: { name: string; link: string; icon: string }[] | null;
  @Input()
  apps?: AppNavigation[] | null;
  @Input()
  address?: string | null;

  constructor() {}

  ngOnInit(): void {}
}
