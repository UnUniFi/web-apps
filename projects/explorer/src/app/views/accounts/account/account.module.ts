import { MaterialModule } from '../../../views/material.module';
import { AccountComponent } from './account.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../../../../../../portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [AccountComponent],
  exports: [AccountComponent],
  imports: [CommonModule, RouterModule, MaterialModule, PipesModule],
})
export class AccountModule {}
