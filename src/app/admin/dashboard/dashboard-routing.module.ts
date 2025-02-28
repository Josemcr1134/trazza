import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path:'',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
    children:[
      {
        path:'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
      },
      {
        path:'users',
        loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
      },
      {
        path:'transactions',
        loadComponent: () => import('./transactions/transactions.component').then(m => m.TransactionsComponent),
      },
      {
        path:'configurations',
        loadComponent: () => import('./configurations/configurations.component').then(m => m.ConfigurationsComponent),
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
