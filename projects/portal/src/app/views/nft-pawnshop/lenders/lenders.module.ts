import { MaterialModule } from '../../material.module';
import { LendersComponent } from './lenders.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LendersComponent],
  imports: [CommonModule, MaterialModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [LendersComponent],
})
export class LendersModule {}
