import { UnjailSimpleModule } from '../../views/slashing/unjail-simple/unjail-simple.module';
import { UnjailModule } from '../../views/slashing/unjail/unjail.module';
import { SlashingRoutingModule } from './slashing-routing.module';
import { UnjailSimpleComponent } from './unjail-simple/unjail-simple.component';
import { UnjailComponent } from './unjail/unjail.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [UnjailComponent, UnjailSimpleComponent],
  imports: [CommonModule, SlashingRoutingModule, UnjailModule, UnjailSimpleModule],
})
export class AppSlashingModule {}
