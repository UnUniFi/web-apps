import { DevelopersComponent } from './developers.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [DevelopersComponent],
  imports: [CommonModule,MaterialModule],
  exports: [DevelopersComponent],
})
export class DevelopersModule {}
