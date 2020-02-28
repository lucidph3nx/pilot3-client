import { Routes } from '@angular/router';

import { CurrentServicesTableComponent } from './current-services/current-services.table';
import { MatangiUnitsTableComponent } from './matangi-units/matangi-units.table';
import { ServiceDetailComponent } from './service-detail/service-detail.page';
import { TimeDistanceComponent } from './time-distance/time-distance.page';
import { NotInServiceTableComponent } from './not-in-service/not-in-service.table';

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
    path: 'not-in-service',
    component: NotInServiceTableComponent,
    data: { title: 'NIS List', breadcrumb: 'NIS List' }
  },
  {
    path: 'detail',
    component: ServiceDetailComponent,
    data: { title: 'Service Detail', breadcrumb: 'Service Detail' }
  },
  {
    path: 'time-distance',
    component: TimeDistanceComponent,
    data: { title: 'Time Distance Graph', breadcrumb: 'Time Distance Graph' }
  },
];