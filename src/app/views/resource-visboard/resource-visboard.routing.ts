import { Routes } from '@angular/router';

import { ResourceVisboardComponent } from './resource-visboard/resource-visboard.component';

export const ResourceVisboardRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'resource-visboard',
      component: ResourceVisboardComponent,
      data: { title: 'Resource Visboard', breadcrumb: 'Resource Visboard' }
    }]
  }
];