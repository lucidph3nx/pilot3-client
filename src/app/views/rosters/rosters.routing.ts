import { Routes } from '@angular/router';

import { RosterStatusTableComponent } from './roster-status/roster-status.table';
import { ShiftDetailPage } from './shift-detail/shift-detail.page';
import { StaffHolistic } from './staff-holistic/staff-holistic.page';
import { ShiftVisualiser } from './shift-visualiser/shift-visualiser.page';
import { StaffVisualiser } from './staff-visualiser/staff-visualiser.page';

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
      path: 'shift-visualiser',
      component: ShiftVisualiser,
      data: { title: 'Shift Visualiser', breadcrumb: 'Shift Visualiser' }
    }, {
      path: 'staff-visualiser',
      component: StaffVisualiser,
      data: { title: 'Staff Visualiser', breadcrumb: 'Staff Visualiser' }
    }, {
      path: 'staff-holistic',
      component: StaffHolistic,
      data: { title: 'Staff Holistic', breadcrumb: 'Staff Holistic' }
    }]
  }
];