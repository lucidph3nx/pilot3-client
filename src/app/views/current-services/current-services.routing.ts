import { Routes } from '@angular/router';

import { CurrentServicesTableComponent } from './current-services/current-services.table';
import { MatangiUnitsTableComponent } from './matangi-units/matangi-units.table';

export const CurrentServicesRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'variance',
      component: CurrentServicesTableComponent,
      data: { title: 'Variance', breadcrumb: 'Variance' }
    },
    {
      path: 'matangi-units',
      component: MatangiUnitsTableComponent,
      data: { title: 'Matangi Units', breadcrumb: 'Matangi Units' }
    }]
  }
];