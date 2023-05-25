import { MaterialModule } from '../material.module';
import { ViewBalanceComponent } from './balance.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../../pipes/pipes.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewBalanceComponent],
  imports: [CommonModule, RouterModule,FormsModule, MaterialModule,PipesModule],
  exports: [ViewBalanceComponent],
})
export class ViewBalanceModule {}
