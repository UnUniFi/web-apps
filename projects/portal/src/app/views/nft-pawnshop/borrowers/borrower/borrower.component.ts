import { Component, Input, OnInit } from '@angular/core';
import { ListedNfts200ResponseListingsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.css'],
})
export class BorrowerComponent implements OnInit {
  @Input()
  address?: string | null;
  @Input()
  listedOwnNfts?: ListedNfts200ResponseListingsInner[] | null;

  constructor() {}

  ngOnInit(): void {}
}
