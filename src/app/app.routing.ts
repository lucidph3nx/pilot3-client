import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/services/auth/auth.guard';

export const rootRouterConfig: Routes = [
  {
    path: '', 
    redirectTo: 'current-services/variance', 
    pathMatch: 'full' 
  },
  {
    path: 'pilot', 
    redirectTo: 'current-services/variance', 
    pathMatch: 'full' 
  },
  {
    path: '', 
    component: AuthLayoutComponent,
    children: [
      { 
        path: 'sessions', 
        loadChildren: './views/sessions/sessions.module#SessionsModule',
        data: { title: 'Session'} 
      }
    ]
  },
  {
    path: '', 
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'current-services', 
        loadChildren: './views/current-services/current-services.module#CurrentServicesModule', 
        data: { title: 'Current Services', breadcrumb: 'CurrentServices'}
      }
    ]
  },
  {
    path: '', 
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'rosters', 
        loadChildren: './views/rosters/rosters.module#RostersModule', 
        data: { title: 'Rosters', breadcrumb: 'Rosters'}
      }
    ]
  },
  {
    path: '', 
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'others', 
        loadChildren: './views/others/others.module#OthersModule', 
        data: { title: 'Others', breadcrumb: 'OTHERS'}
      }
    ]
  },
  { 
    path: '**', 
    redirectTo: 'sessions/404'
  }
];

