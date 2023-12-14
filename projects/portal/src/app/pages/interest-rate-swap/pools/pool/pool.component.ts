import { Component, OnInit } from '@angular/core';
import { IrsApplicationService } from 'projects/portal/src/app/models/irs/irs.application.service';
import { MintLpRequest, RedeemLpRequest } from 'projects/portal/src/app/models/irs/irs.model';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit {
  constructor(private readonly irsAppService: IrsApplicationService) {}

  ngOnInit(): void {}

  onMintLP(data: MintLpRequest) {
    this.irsAppService.mintLP(data);
  }
  onRedeemLP(data: RedeemLpRequest) {
    this.irsAppService.redeemLP(data);
  }
}
