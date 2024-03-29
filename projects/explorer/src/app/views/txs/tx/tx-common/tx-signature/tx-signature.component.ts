import { Component, OnInit, Input } from '@angular/core';
import { txSignature } from './../../../../../models/cosmos/tx-common.model';

@Component({
  selector: 'view-tx-signature',
  templateUrl: './tx-signature.component.html',
  styleUrls: ['./tx-signature.component.css']
})
export class TxSignatureComponent implements OnInit {

  @Input() txSignature?: txSignature | null;

  constructor() { }

  ngOnInit(): void {
  }

}
