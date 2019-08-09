import { Routes } from '@angular/router';
import { StatusPageComponent } from './status-page/status-page.component';

export const PilotStatusRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'status-page',
      component: StatusPageComponent,
      data: { title: 'Status Page', breadcrumb: 'Status Page' }
    }]
  }
];