import { MintModule } from '../../views/mint/mint.module';
import { MintRoutingModule } from './mint-routing.module';
import { MintComponent } from './mint.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [MintComponent],
  imports: [CommonModule, MintRoutingModule, MintModule],
})
export class AppMintModule {}
