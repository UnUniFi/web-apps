import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { AllRewards200ResponseRewardRecord } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-incentive',
  templateUrl: './incentive.component.html',
  styleUrls: ['./incentive.component.css'],
})
export class IncentiveComponent implements OnInit {
  @Input()
  address?: string | null;
  @Input()
  unitIds?: string[] | null;
  @Input()
  rewards?: AllRewards200ResponseRewardRecord | null;
  @Output()
  appClickCreate: EventEmitter<string>;
  @Output()
  appClickReward: EventEmitter<string>;
  @Output()
  appClickAllRewards: EventEmitter<string>;

  constructor() {
    this.appClickCreate = new EventEmitter();
    this.appClickReward = new EventEmitter();
    this.appClickAllRewards = new EventEmitter();
  }

  ngOnInit(): void {}

  onClickCreate() {
    this.appClickCreate.emit(this.address!);
  }
  onClickReward(denom: string | undefined) {
    if (!denom) {
      return;
    }
    this.appClickReward.emit(denom);
  }
  onClickAllRewards() {
    this.appClickAllRewards.emit(this.address!);
  }
}
