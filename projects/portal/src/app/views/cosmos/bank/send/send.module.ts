import { MaterialModule } from '../../../../views/material.module';
import { SendComponent } from './send.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SendComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule,],
  exports: [SendComponent],
})
export class SendModule {}
