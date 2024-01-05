import { VaultComponent } from './vault.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [VaultComponent],
  imports: [CommonModule, RouterModule, FormsModule, PipesModule],
  exports: [VaultComponent],
})
export class VaultModule {}
