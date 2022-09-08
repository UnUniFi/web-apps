import { MaterialModule } from '../material.module';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from '@ununifi/shared';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule, PipesModule],
  exports: [DashboardComponent],
})
export class DashboardModule {}
