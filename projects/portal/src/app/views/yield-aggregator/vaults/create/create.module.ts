import { MaterialModule } from '../../../material.module';
import { CreateComponent } from './create.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [CreateComponent],
  imports: [CommonModule, MaterialModule],
  exports: [CreateComponent],
})
export class CreateModule {}
