import { MyPageRoutingModule } from './my-page-routing.module';
import { MyPageComponent } from './my-page.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibViewNftsModule } from 'projects/shared/src/lib/views/nfts/nfts.module';

@NgModule({
  declarations: [MyPageComponent],
  imports: [CommonModule, MyPageRoutingModule, LibViewNftsModule],
})
export class AppMyPageModule {}
