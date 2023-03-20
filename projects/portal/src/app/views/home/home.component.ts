import { Component, OnInit, Input } from '@angular/core';
import { GetNodeInfo200Response } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @Input()
  nodeInfo?: GetNodeInfo200Response | null;

  @Input()
  syncing?: boolean | null;

  constructor() {}

  ngOnInit(): void {}
}
