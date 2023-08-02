import { OwnerComponent } from './owner.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [OwnerComponent],
  imports: [CommonModule, RouterModule, PipesModule, FormsModule],
  exports: [OwnerComponent],
})
export class OwnerModule {}
