import { Component, OnInit, Input } from '@angular/core';
import { txTitle, } from './../../../../models/cosmos/tx-common.model';

@Component({
  selector: 'app-tx-messages',
  templateUrl: './tx-messages.component.html',
  styleUrls: ['./tx-messages.component.css']
})
export class TxMessagesComponent implements OnInit {

  @Input() txDetails?: txTitle[] | null;

  @Input() txTypes?: string[]

  constructor() { }

  ngOnInit(): void {
  }

}
