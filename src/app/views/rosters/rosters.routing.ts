import { Routes } from '@angular/router';

import { RosterStatusTableComponent } from './roster-status/roster-status.table';
import { ShiftDetailPage } from './shift-detail/shift-detail.page';
import { StaffHolistic } from './staff-holistic/staff-holistic.page';

export const RostersRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'roster-status',
      component: RosterStatusTableComponent,
      data: { title: 'Roster Status', breadcrumb: 'Roster Status' }
    }, {
      path: 'shift-detail',
      component: ShiftDetailPage,
      data: { title: 'Shift Detail', breadcrumb: 'Shift Detail' }
    }, {
      path: 'staff-holistic',
      component: StaffHolistic,
      data: { title: 'Staff Holistic', breadcrumb: 'Staff Holistic' }
    }]
  }
];