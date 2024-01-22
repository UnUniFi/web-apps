import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'view-interest-rate-swap',
  templateUrl: './interest-rate-swap.component.html',
  styleUrls: ['./interest-rate-swap.component.css'],
})
export class InterestRateSwapComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const top = document.getElementById('page-top');
    if (top)
      top.scrollIntoView({
        block: 'start',
      });
  }
}
