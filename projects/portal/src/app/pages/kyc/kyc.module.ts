import { KycModule } from '../../views/kyc/kyc.module';
import { VerificationsModule } from '../../views/kyc/verifications/verifications.module';
import { KycRoutingModule } from './kyc-routing.module';
import { KycComponent } from './kyc.component';
import { VerificationsComponent } from './verifications/verifications.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [KycComponent, VerificationsComponent],
  imports: [CommonModule, KycRoutingModule, KycModule, VerificationsModule],
})
export class AppKycModule {}
