import { AppToolModule } from '../../../views/tools/app-tool/app-tool.module';
import { AppToolComponent } from './app-tool.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AppToolComponent],
  imports: [CommonModule, AppToolModule],
  exports: [AppToolComponent],
})
export class AppAppToolModule {}
