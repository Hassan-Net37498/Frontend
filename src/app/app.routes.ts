import { Routes } from '@angular/router';
import { Login } from './login/login';
import { DashboardComponent } from './dashboard-component/dashboard-component';
import { AuthGuard } from './auth-guard';
import { UsersList } from './users-list/users-list';
import { CommissionListComponent } from './commission-list-component/commission-list-component';
import { WithdrawalComponent } from './withdrawal-component/withdrawal-component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
   
  },
   { 
    path: 'users', 
    component: UsersList,
    canActivate: [AuthGuard]
  },
  { 
    path: 'comission', 
    component: CommissionListComponent,
    canActivate: [AuthGuard]
  },
   { 
    path: 'withdraw', 
    component: WithdrawalComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];