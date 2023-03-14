import { StrategiesComponent } from './strategies.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [StrategiesComponent],
  imports: [CommonModule, RouterModule],
  exports: [StrategiesComponent],
})
export class StrategiesModule {}
