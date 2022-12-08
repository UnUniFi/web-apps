import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';

@Component({
  selector: 'view-incentive',
  templateUrl: './incentive.component.html',
  styleUrls: ['./incentive.component.css'],
})
export class IncentiveComponent implements OnInit {
  @Input()
  tokens?: { id: string }[] | null;
  @Input()
  rewards?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
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
