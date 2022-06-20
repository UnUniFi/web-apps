import { MaterialModule } from '../material.module';
import { AssetsComponent } from './assets.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AssetsComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [AssetsComponent],
})
export class AssetsModule {}
