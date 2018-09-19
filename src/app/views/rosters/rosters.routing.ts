import { Routes } from '@angular/router';

import { RosterStatusTableComponent } from './roster-status/roster-status.table';


export const RostersRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'roster-status',
      component: RosterStatusTableComponent,
      data: { title: 'Roster Status', breadcrumb: 'Roster Status' }
    }]
  }
];