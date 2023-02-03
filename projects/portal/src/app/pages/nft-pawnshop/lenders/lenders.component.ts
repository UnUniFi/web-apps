import { BalanceUsecaseService } from '../../balance/balance.usecase.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lenders',
  templateUrl: './lenders.component.html',
  styleUrls: ['./lenders.component.css'],
})
export class LendersComponent implements OnInit {
  balances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null | undefined>;

  constructor(private usecase: BalanceUsecaseService) {
    this.balances$ = this.usecase.balances$;
  }

  ngOnInit(): void {}
}
