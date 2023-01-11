import { MaterialModule } from '../../../material.module';
import { UnitComponent } from './unit.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [UnitComponent],
  imports: [CommonModule, RouterModule, MaterialModule, ClipboardModule, PipesModule],
  exports: [UnitComponent],
})
export class TokenModule {}
