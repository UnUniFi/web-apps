import { KycModule } from '../../views/kyc/kyc.module';
import { KycRoutingModule } from './kyc-routing.module';
import { KycComponent } from './kyc.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [KycComponent],
  imports: [CommonModule, KycRoutingModule, KycModule],
})
export class AppKycModule {}
