import { NftInfo, Nfts } from '../../../models/nft-pawnshops/nft-pawnshop.model';
import { Component, Input, OnInit } from '@angular/core';
import { ListedNfts200ResponseListingsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-borrowers',
  templateUrl: './borrowers.component.html',
  styleUrls: ['./borrowers.component.css'],
})
export class BorrowersComponent implements OnInit {
  @Input()
  address?: string | null;
  @Input()
  ownNfts?: Nfts | null;
  @Input()
  listedOwnNfts?: ListedNfts200ResponseListingsInner[] | null;
  @Input()
  notListedOwnNfts?: NftInfo[] | null;

  constructor() {}

  ngOnInit(): void {}
}
