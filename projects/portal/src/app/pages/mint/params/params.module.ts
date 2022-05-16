import { CollateralParamModule } from '../../../views/mint/params/collateral-param/collateral-param.module';
import { DebtParamModule } from '../../../views/mint/params/debt-param/debt-param.module';
import { CollateralParamComponent } from './collateral-param/collateral-param.component';
import { DebtParamComponent } from './debt-param/debt-param.component';
import { ParamsRoutingModule } from './params-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DebtParamComponent, CollateralParamComponent],
  imports: [CommonModule, ParamsRoutingModule, CollateralParamModule, DebtParamModule],
})
export class AppParamsModule {}
