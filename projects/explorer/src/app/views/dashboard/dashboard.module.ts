import { PipesModule } from '../../pipes/pipes.module';
import { MaterialModule } from '../material.module';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule, PipesModule],
  exports: [DashboardComponent],
})
export class DashboardModule {}
