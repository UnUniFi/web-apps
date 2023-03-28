import { MaterialModule } from '../../material.module';
import { AppToolComponent } from './app-tool.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppToolComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [AppToolComponent],
})
export class AppToolModule {}
