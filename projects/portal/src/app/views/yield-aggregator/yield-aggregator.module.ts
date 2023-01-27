import { YieldAggregatorComponent } from './yield-aggregator.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [YieldAggregatorComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [YieldAggregatorComponent],
})
export class YieldAggregatorModule {}
