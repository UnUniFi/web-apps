import { Component, Input, OnInit } from '@angular/core';
import { InlineResponse20038, InlineResponse20041 } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-delegator',
  templateUrl: './delegator.component.html',
  styleUrls: ['./delegator.component.css'],
})
export class DelegatorComponent implements OnInit {
  @Input()
  delegations?: InlineResponse20038 | null;

  @Input()
  validators?: InlineResponse20041 | null;

  constructor() {}

  ngOnInit(): void {}
}
