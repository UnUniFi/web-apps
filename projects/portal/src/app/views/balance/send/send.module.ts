import { PipesModule } from '../../../pipes/pipes.module';
import { MaterialModule } from '../../material.module';
import { SendComponent } from './send.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SendComponent],
  imports: [CommonModule, FormsModule, RouterModule, MaterialModule, PipesModule],
  exports: [SendComponent],
})
export class SendModule {}
