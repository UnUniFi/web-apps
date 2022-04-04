import { PipesModule } from '../../pipes/pipes.module';
import { MaterialModule } from '../material.module';
import { MonitorComponent } from './monitor.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MonitorComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule,
    PipesModule,
  ],
  exports: [MonitorComponent],
})
export class MonitorModule {}
