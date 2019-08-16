import { Routes } from '@angular/router';

import { CurrentServicesTableComponent } from './current-services/current-services.table';
import { MatangiUnitsTableComponent } from './matangi-units/matangi-units.table';
import { ServiceDetailComponent } from './service-detail/service-detail.page';

export const ServicesRoutes: Routes = [
  {
    path: 'variance',
    component: CurrentServicesTableComponent,
    data: { title: 'Variance', breadcrumb: 'Variance' }
  },
  {
    path: 'matangi-units',
    component: MatangiUnitsTableComponent,
    data: { title: 'Matangi Units', breadcrumb: 'Matangi Units' }
  },
  {
    path: 'detail',
    component: ServiceDetailComponent,
    data: { title: 'Service Detail', breadcrumb: 'Service Detail' }
  },
];