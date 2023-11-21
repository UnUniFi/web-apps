import { VaultComponent } from './vault.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [VaultComponent],
  imports: [CommonModule, RouterModule],
  exports: [VaultComponent],
})
export class VaultModule {}
