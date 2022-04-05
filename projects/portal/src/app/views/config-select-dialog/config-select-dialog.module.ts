import { ConfigSelectDialogComponent } from './config-select-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [ConfigSelectDialogComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [ConfigSelectDialogComponent],
})
export class ConfigSelectDialogModule { }
