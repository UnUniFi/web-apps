import { MaterialModule } from '../material.module';
import { ViewBalanceComponent } from './balance.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [ViewBalanceComponent],
  imports: [CommonModule, RouterModule, MaterialModule,PipesModule],
  exports: [ViewBalanceComponent],
})
export class ViewBalanceModule {}
