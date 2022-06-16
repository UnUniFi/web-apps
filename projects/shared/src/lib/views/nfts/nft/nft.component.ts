import { NFT } from '../../../models/cosmos/nfts/nft.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-view-nft',
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.css'],
})
export class LibViewNftComponent implements OnInit {
  @Input() nft?: NFT | null;

  constructor() {}

  ngOnInit(): void {}
}
