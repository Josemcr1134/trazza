import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'set-email',
    loadComponent: () => import('./set-email/set-email.component').then(m => m.SetEmailComponent)
  },
  {
    path: 'validate-email',
    loadComponent: () => import('./validate-email/validate-email.component').then(m => m.ValidateEmailComponent)
  },
  {
    path: 'set-password',
    loadComponent: () => import('./set-password/set-password.component').then(m => m.SetPasswordComponent)
  },
  {
    path: 'set-general-info',
    loadComponent: () => import('./set-general-info/set-general-info.component').then(m => m.SetGeneralInfoComponent)
  },
  {
    path: 'set-kyc',
    loadComponent: () => import('./set-kyc/set-kyc.component').then(m => m.SetKycComponent)
  },
  {
    path:'**',
    redirectTo:'set-email',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
