import { VaultComponent } from './vault.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [VaultComponent],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [VaultComponent],
})
export class VaultModule {}