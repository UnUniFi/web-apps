import { SimpleVaultComponent } from './simple-vault.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SimpleVaultComponent],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [SimpleVaultComponent],
})
export class SimpleVaultModule {}
