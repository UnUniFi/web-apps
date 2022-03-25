import { MaterialModule } from '../../material.module';
import { CdpsComponent } from './cdps.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CdpsComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [CdpsComponent],
})
export class CdpsModule {}
