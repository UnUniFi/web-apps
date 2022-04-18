import { ValidatorComponent } from './validator/validator.component';
import { ValidatorsComponent } from './validators.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ValidatorsComponent,
  },
  {
    path: ':address',
    component: ValidatorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidatorsRoutingModule {}
