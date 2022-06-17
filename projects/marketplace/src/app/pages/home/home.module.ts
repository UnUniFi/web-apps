import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibViewNftsModule } from 'projects/shared/src/lib/views/nfts/nfts.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, LibViewNftsModule],
})
export class AppHomeModule {}
