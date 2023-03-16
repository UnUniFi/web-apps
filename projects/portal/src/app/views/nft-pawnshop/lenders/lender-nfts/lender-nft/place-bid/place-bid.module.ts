import { PlaceBidComponent } from './place-bid.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GoogleChartsModule } from 'angular-google-charts';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';
import { MaterialModule } from 'projects/portal/src/app/views/material.module';

@NgModule({
  declarations: [PlaceBidComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    GoogleChartsModule,
    PipesModule,
  ],
  exports: [PlaceBidComponent],
})
export class PlaceBidModule {}
