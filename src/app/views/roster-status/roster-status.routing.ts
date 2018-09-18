import { Routes } from '@angular/router';

import { RosterStatusTableComponent } from './roster-status/roster-status.table';


export const RosterStatusRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'rosterStatus',
      component: RosterStatusTableComponent,
      data: { title: 'Rosters', breadcrumb: 'Rosters' }
    }]
  }
];