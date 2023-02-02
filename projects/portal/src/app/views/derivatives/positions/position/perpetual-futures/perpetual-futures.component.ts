import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'view-perpetual-futures',
  templateUrl: './perpetual-futures.component.html',
  styleUrls: ['./perpetual-futures.component.css'],
})
export class PerpetualFuturesComponent implements OnInit {
  @Output()
  closePosition = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
