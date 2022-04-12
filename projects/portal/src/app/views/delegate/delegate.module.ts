import { PipesModule } from '../../pipes/pipes.module';
import { MaterialModule } from '../material.module';
import { DelegateComponent } from './delegate.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DelegateComponent],
  imports: [CommonModule, RouterModule, MaterialModule, PipesModule],
  exports: [DelegateComponent],
})
export class DelegateModule {}
