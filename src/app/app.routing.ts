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
    path: '', 
    component: AuthLayoutComponent,
    children: [
      { 
        path: 'sessions', 
        loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule),
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
        loadChildren: () => import('./views/current-services/current-services.module').then(m => m.CurrentServicesModule),
        data: { title: 'Current Services', breadcrumb: 'CurrentServices'}
      },
      {
        path: 'train-performance', 
        loadChildren: () => import('./views/train-performance/train-performance.module').then(m => m.TrainPerformanceModule),
        data: { title: 'Train Performance', breadcrumb: 'Train Performance'}
      },
      {
        path: 'rosters', 
        loadChildren: () => import('./views/rosters/rosters.module').then(m => m.RostersModule),
        data: { title: 'Rosters', breadcrumb: 'Rosters'}
      },
      {
        path: 'resource-visboard', 
        loadChildren: () => import('./views/resource-visboard/resource-visboard.module').then(m => m.ResourceVisboardModule),
        data: { title: 'Resource Visboard', breadcrumb: 'Resource Visboard'}
      },
      {
        path: 'rti-boards', 
        loadChildren: () => import('./views/rti-boards/rti-boards.module').then(m => m.RtiBoardsModule),
        data: { title: 'RTI', breadcrumb: 'RTI'}
      },
      {
        path: 'pilot-status', 
        loadChildren: () => import('./views/pilot-status/pilot-status.module').then(m => m.PilotStatusModule), 
        data: { title: 'Pilot Status', breadcrumb: 'Pilot Status'}
      },
      {
        path: 'others', 
        loadChildren: () => import('./views/others/others.module').then(m => m.OthersModule), 
        data: { title: 'Others', breadcrumb: 'OTHERS'}
      }
    ]
  },
  { 
    path: '**', 
    redirectTo: 'sessions/404'
  }
];