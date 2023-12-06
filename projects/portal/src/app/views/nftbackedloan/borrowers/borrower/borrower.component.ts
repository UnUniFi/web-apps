import { Component, Input, OnInit } from '@angular/core';
import { NftInfo, Nfts } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { Metadata } from 'projects/portal/src/app/models/nft/nft.model';
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
  @Input()
  listedOwnNftImages?: string[] | null;
  @Input()
  listedOwnNftsMetadata?: Metadata[] | null;
  @Input()
  notListedOwnNfts?: NftInfo[] | null;
  @Input()
  notListedOwnNftImages?: string[] | null;
  @Input()
  notListedOwnNftsMetadata?: Metadata[] | null;

  constructor() {}

  ngOnInit(): void {}
}
