import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path:'',
    component:DashboardComponent,
    children:[
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'card-center',
        loadComponent: () => import('./card-center/card-center.component').then(m => m.CardCenterComponent)
      },
      {
        path: 'recharge-wallet',
        loadComponent: () => import('./recharge-wallet/recharge-wallet.component').then(m => m.RechargeWalletComponent)
      },
      {
        path: 'tutorials',
        loadComponent: () => import('./tutorials/tutorials.component').then(m => m.TutorialsComponent)
      },
      {
        path: 'support',
        loadComponent: () => import('./support/support.component').then(m => m.SupportComponent)
      },
      {
        path: 'my-profile',
        loadComponent: () => import('./my-profile/my-profile.component').then(m => m.MyProfileComponent)
      },
      {
        path:'**',
        redirectTo:'home',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
