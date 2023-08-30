import { AdminComponent } from './admin/admin.component';
import { KycRoutingModule } from './kyc-routing.module';
import { KycComponent } from './kyc.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [KycComponent, AdminComponent],
  imports: [CommonModule, KycRoutingModule, FormsModule],
})
export class KycModule {}
