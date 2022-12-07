import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';

@Component({
  selector: 'view-incentive',
  templateUrl: './incentive.component.html',
  styleUrls: ['./incentive.component.css'],
})
export class IncentiveComponent implements OnInit {
  tokens: { id: string }[] | undefined;
  rewards: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined;

  constructor() {
    this.tokens = [{ id: 'ununifi-incentive-test01' }, { id: 'ununifi-incentive-test02' }];
    this.rewards = [{ denom: 'uguu', amount: '20000000' }];
  }

  ngOnInit(): void {}
}
