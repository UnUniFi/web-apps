import { Provider } from '../../models/kyc/Kyc.types';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'view-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css'],
})
export class KycComponent implements OnInit {
  @Input()
  providers?: Provider[] | null;

  constructor() {}

  ngOnInit(): void {}
}
