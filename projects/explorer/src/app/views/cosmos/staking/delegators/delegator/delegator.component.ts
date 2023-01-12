import { Component, Input, OnInit } from '@angular/core';
import {
  DelegatorDelegations200Response,
  StakingDelegatorValidators200Response,
} from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-delegator',
  templateUrl: './delegator.component.html',
  styleUrls: ['./delegator.component.css'],
})
export class DelegatorComponent implements OnInit {
  @Input()
  delegations?: DelegatorDelegations200Response | null;

  @Input()
  validators?: StakingDelegatorValidators200Response | null;

  constructor() {}

  ngOnInit(): void {}
}
