import { PipesModule } from '../../../pipes/pipes.module';
import { SimpleVaultsComponent } from './simple-vaults.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SimpleVaultsComponent],
  imports: [CommonModule, RouterModule, PipesModule],
  exports: [SimpleVaultsComponent],
})
export class SimpleVaultsModule {}
