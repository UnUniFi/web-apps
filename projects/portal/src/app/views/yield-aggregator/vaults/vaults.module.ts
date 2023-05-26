import { PipesModule } from '../../../pipes/pipes.module';
import { MaterialModule } from '../../material.module';
import { VaultsComponent } from './vaults.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [VaultsComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule, PipesModule],
  exports: [VaultsComponent],
})
export class VaultsModule {}
