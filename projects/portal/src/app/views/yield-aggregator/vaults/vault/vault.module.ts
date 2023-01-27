import { MaterialModule } from '../../../material.module';
import { VaultComponent } from './vault.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [VaultComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [VaultComponent],
})
export class VaultModule {}
