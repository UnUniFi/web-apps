import { Component, OnInit, Input } from '@angular/core';
import { txTitle, txSignature } from './../../../../../models/cosmos/tx-common.model';

@Component({
  selector: 'view-msg-delegate',
  templateUrl: './msg-delegate.component.html',
  styleUrls: ['./msg-delegate.component.css']
})
export class MsgDelegateComponent implements OnInit {

  @Input() txDetail?: txTitle | null;
  @Input() txSignature?: txSignature | null;

  constructor() { }

  ngOnInit(): void { }
}
