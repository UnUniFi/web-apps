import { Component, Input, OnInit } from '@angular/core';
import { InlineResponse20052 } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css'],
})
export class VoteComponent implements OnInit {
  @Input()
  proposals?: InlineResponse20052 | null;

  constructor() {}

  ngOnInit(): void {}
}
