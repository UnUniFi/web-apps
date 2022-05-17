import { MaterialModule } from '../../material.module';
import {
  CreateValidatorMultipleComponent,
  ValidatorDialog,
} from './create-validator-multiple.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [CreateValidatorMultipleComponent, ValidatorDialog],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgxDropzoneModule,
    NgxSkeletonLoaderModule,
    RouterModule,
  ],
  exports: [CreateValidatorMultipleComponent],
})
export class ViewCreateValidatorMultipleModule {}
