import { Item } from '../../pages/assets/assets.component';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'view-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css'],
})
export class AssetsComponent implements OnInit {
  @Input()
  items?: Item[] | null;
  constructor() {}

  ngOnInit(): void {}
}
