import { Routes } from '@angular/router';

import { CurrentServicesTableComponent } from './current-services/current-services.table';


export const CurrentServicesRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'variance',
      component: CurrentServicesTableComponent,
      data: { title: 'Variance', breadcrumb: 'Variance' }
    }]
  }
];