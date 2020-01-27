import { Routes } from '@angular/router';
import { EntryComponent } from './entry/entry.component';

export const OccurenceLogRouting: Routes = [
  {
    path: '',
    children: [{
      path: 'entry',
      component: EntryComponent,
      data: { title: 'Occurence Log Entry', breadcrumb: 'Occurence Log Entry' }
    }]
  }
];