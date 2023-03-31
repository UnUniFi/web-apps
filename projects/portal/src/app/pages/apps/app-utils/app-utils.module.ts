import { AppUtilsModule } from '../../../views/apps/app-utils/app-utils.module';
import { AppUtilsRoutingModule } from './app-utils-routing.module';
import { AppUtilsComponent } from './app-utils.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AppUtilsComponent],
  imports: [CommonModule, AppUtilsRoutingModule, AppUtilsModule],
})
export class AppAppUtilsModule {}
