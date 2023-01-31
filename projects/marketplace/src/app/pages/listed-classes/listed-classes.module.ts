import { ClassModule } from '../../views/listed-classes/class/class.module';
import { NftModule } from '../../views/listed-classes/class/nft/nft.module';
import { ListedClassesModule } from '../../views/listed-classes/listed-classes.module';
import { ClassComponent } from './class/class.component';
import { NftComponent } from './class/nft/nft.component';
import { ListedClassesRoutingModule } from './listed-classes-routing.module';
import { ListedClassesComponent } from './listed-classes.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ListedClassesComponent, ClassComponent, NftComponent],
  imports: [CommonModule, ListedClassesRoutingModule, ListedClassesModule, ClassModule, NftModule],
})
export class AppListedClassesModule {}
