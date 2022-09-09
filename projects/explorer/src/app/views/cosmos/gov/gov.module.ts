import { MaterialModule } from '../../material.module';
import { GovComponent } from './gov.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [GovComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [GovComponent],
})
export class GovModule {}
