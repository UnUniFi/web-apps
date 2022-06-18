import { AssetsModule } from '../../views/assets/assets.module';
import { AssetsRoutingModule } from './assets-routing.module';
import { AssetsComponent } from './assets.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AssetsComponent],
  imports: [CommonModule, AssetsRoutingModule, AssetsModule],
})
export class AppAssetsModule {}
