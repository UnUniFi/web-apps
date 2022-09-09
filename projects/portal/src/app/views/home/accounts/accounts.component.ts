import { Key } from '../../../models/keys/key.model';
import { Component, Input, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';

@Component({
  selector: 'view-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent implements OnInit {
  @Input()
  keys?: Key[] | null;
  @Input()
  accAddresses?: cosmosclient.AccAddress[] | null;
  @Input()
  balances0?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  balances1?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  balances2?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  constructor() {}

  ngOnInit(): void {}
}
