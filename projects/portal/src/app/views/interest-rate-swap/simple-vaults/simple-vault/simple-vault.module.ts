import { SimpleVaultComponent } from './simple-vault.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [SimpleVaultComponent],
  imports: [CommonModule, RouterModule, FormsModule, PipesModule],
  exports: [SimpleVaultComponent],
})
export class SimpleVaultModule {}
