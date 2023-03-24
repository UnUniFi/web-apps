import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CreateVaultRequest } from 'projects/portal/src/app/models/ununifi/yield-aggregator.model';

@Component({
  selector: 'view-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  @Output()
  appCreate: EventEmitter<CreateVaultRequest>;

  firstStrategy = { id: '', distRate: 100 };
  strategies: { id: string; distRate: number }[] = [];
  selectedSymbol = 'USDC';

  constructor() {
    this.appCreate = new EventEmitter();
  }

  ngOnInit(): void {}

  onClickAddStrategy() {
    this.strategies.push({ id: '', distRate: 0 });
  }
  onClickDeleteStrategy(index: number) {
    this.strategies.splice(index, 1);
  }
}
