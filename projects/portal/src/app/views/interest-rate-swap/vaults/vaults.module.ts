import { VaultsComponent } from './vaults.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [VaultsComponent],
  imports: [CommonModule, RouterModule],
  exports: [VaultsComponent],
})
export class VaultsModule {}
