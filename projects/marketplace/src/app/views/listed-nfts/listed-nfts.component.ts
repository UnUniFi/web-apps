import { Component, Input, OnInit } from '@angular/core';
import { ListedClass200Response } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-listed-nfts',
  templateUrl: './listed-nfts.component.html',
  styleUrls: ['./listed-nfts.component.css'],
})
export class ListedNftsComponent implements OnInit {
  @Input()
  listedClasses?: ListedClass200Response[] | null;
  @Input()
  classImages?: string[] | null;

  constructor() {}

  ngOnInit(): void {}
}
