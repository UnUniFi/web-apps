import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdpAll200ResponseCdpInnerCdpCollateral } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-incentive',
  templateUrl: './incentive.component.html',
  styleUrls: ['./incentive.component.css'],
})
export class IncentiveComponent implements OnInit {
  @Input()
  units?: { id: string }[] | null;
  @Input()
  rewards?: CdpAll200ResponseCdpInnerCdpCollateral[] | null;
  @Output()
  appClickCreate: EventEmitter<{}>;

  constructor() {
    this.appClickCreate = new EventEmitter();
  }

  ngOnInit(): void {}

  onClickCreate() {
    this.appClickCreate.emit();
  }
}
