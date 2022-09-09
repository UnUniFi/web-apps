import { txTitle } from './../../../../../models/cosmos/tx-common.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'view-msg-create-validator',
  templateUrl: './msg-create-validator.component.html',
  styleUrls: ['./msg-create-validator.component.css'],
})
export class MsgCreateValidatorComponent implements OnInit {
  @Input() txDetail?: txTitle | null;

  constructor() {}

  ngOnInit(): void {}
}
