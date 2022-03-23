import { Key } from '../../../models/keys/key.model';
import { Component, Input, OnInit } from '@angular/core';
import { cosmosclient, proto } from '@cosmos-client/core';

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
  balances0?: proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  balances1?: proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  balances2?: proto.cosmos.base.v1beta1.ICoin[] | null;

  constructor() {}

  ngOnInit(): void {}
}
