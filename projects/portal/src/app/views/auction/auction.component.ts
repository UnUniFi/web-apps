import { Component, Input, OnInit } from '@angular/core';
import { AuctionParams200ResponseParams } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css'],
})
export class AuctionComponent implements OnInit {
  @Input()
  params?: AuctionParams200ResponseParams | null;

  constructor() {}

  ngOnInit(): void {}
}
