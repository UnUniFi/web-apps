import { SimpleVaultComponent } from './simple-vault.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SimpleVaultComponent],
  imports: [CommonModule, RouterModule],
  exports: [SimpleVaultComponent],
})
export class SimpleVaultModule {}
