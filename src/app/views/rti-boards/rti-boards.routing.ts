import { Routes } from '@angular/router';

import { RtiBoardsComponent } from './rti-boards/rti-boards.component';


export const RtiBoardsRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'rti-boards',
      component: RtiBoardsComponent,
      data: { title: 'RTI', breadcrumb: 'RTI' }
    }]
  }
];