import { MaterialModule } from '../../../material.module';
import { CdpComponent } from './cdp.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CdpComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [CdpComponent],
})
export class CdpModule {}
