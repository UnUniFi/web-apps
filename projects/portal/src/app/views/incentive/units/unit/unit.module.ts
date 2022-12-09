import { MaterialModule } from '../../../material.module';
import { UnitComponent } from './unit.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [UnitComponent],
  imports: [CommonModule, RouterModule, MaterialModule, ClipboardModule],
  exports: [UnitComponent],
})
export class TokenModule {}
