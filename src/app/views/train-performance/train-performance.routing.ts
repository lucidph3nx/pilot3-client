import { Routes } from '@angular/router';
import { TrainPerformanceComponent } from './train-performance/train-performance.component';

export const TrainPerformanceRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'train-performance',
      component: TrainPerformanceComponent,
      data: { title: 'Train Performance', breadcrumb: 'Train Performance' }
    }]
  }
];