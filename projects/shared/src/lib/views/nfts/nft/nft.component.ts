import { Nft } from '../../../models/ununifi/query/nft/nft.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-view-nft',
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.css'],
})
export class LibViewNftComponent implements OnInit {
  @Input() nft?: Nft | null;

  constructor() {}

  ngOnInit(): void {}
}
