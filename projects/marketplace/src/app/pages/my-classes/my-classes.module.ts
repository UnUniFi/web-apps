import { MyClassModule } from '../../views/my-classes/my-class/my-class.module';
import { MyNftModule } from '../../views/my-classes/my-class/my-nft/my-nft.module';
import { MyClassComponent } from './my-class/my-class.component';
import { MyNftComponent } from './my-class/my-nft/my-nft.component';
import { MyClassesRoutingModule } from './my-classes-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [MyClassComponent, MyNftComponent],
  imports: [CommonModule, MyClassesRoutingModule, MyClassModule, MyNftModule],
})
export class AppMyClassesModule {}
