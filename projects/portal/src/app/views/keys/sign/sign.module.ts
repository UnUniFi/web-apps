import { MaterialModule } from '../../material.module';
import { SignComponent } from './sign.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SignComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [SignComponent],
})
export class SignModule {}
