import { ListComponent } from './list.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'projects/portal/src/app/views/material.module';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, MaterialModule, FormsModule, RouterModule],
  exports: [ListComponent],
})
export class ListModule {}
