import { Provider, Verification } from '../../../models/kyc/Kyc.types';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-verifications',
  templateUrl: './verifications.component.html',
  styleUrls: ['./verifications.component.css'],
})
export class VerificationsComponent implements OnInit {
  @Input()
  address?: string | null;

  @Input()
  providers?: Provider[] | null;

  @Input()
  verifications?: Verification[] | null;

  constructor() {}

  ngOnInit(): void {}

  findProvider(providerId: number): Provider | undefined {
    return this.providers?.find((p) => p.id === providerId);
  }
}
