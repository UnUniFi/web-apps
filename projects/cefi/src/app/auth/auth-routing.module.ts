import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignOutComponent } from './sign-out/sign-out.component';
import { AuthGuard, redirectLoggedInTo } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectLoggedInTo(['']),
    },
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectLoggedInTo(['']),
    },
  },
  {
    path: 'sign-out',
    component: SignOutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
