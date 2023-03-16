import { MyPageModule } from '../../views/my-page/my-page.module';
import { MyPageRoutingModule } from './my-page-routing.module';
import { MyPageComponent } from './my-page.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [MyPageComponent],
  imports: [CommonModule, MyPageRoutingModule, MyPageModule],
})
export class AppMyPageModule {}
