import { KeySelectGuard } from '../../models/keys/key-select.guard';
import { CreateValidatorComponent } from './create-validator/create-validator.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'create-validator',
    component: CreateValidatorComponent,
    canActivate: [KeySelectGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StakingRoutingModule {}
