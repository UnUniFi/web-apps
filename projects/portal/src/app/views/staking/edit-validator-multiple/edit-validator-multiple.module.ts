import { MaterialModule } from '../../material.module';
import {
  ViewEditValidatorMultipleComponent,
  ValidatorDialog,
} from './edit-validator-multiple.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [ViewEditValidatorMultipleComponent, ValidatorDialog],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgxDropzoneModule,
    NgxSkeletonLoaderModule,
    RouterModule,
  ],
  exports: [ViewEditValidatorMultipleComponent],
})
export class ViewEditValidatorMultipleModule {}
