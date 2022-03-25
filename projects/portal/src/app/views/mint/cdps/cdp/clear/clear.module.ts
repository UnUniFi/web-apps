import { MaterialModule } from '../../../../material.module';
import { ClearComponent } from './clear.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ClearComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [ClearComponent],
})
export class ClearModule {}
