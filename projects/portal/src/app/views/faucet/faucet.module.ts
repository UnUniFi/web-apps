import { FaucetComponent } from './faucet.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'projects/portal/src/app/views/material.module';

@NgModule({
  declarations: [FaucetComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [FaucetComponent],
})
export class FaucetModule {}
