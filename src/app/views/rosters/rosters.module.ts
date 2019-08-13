import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatChipsModule,
  MatCheckboxModule,
  MatRadioModule,
  MatTabsModule,
  MatInputModule,
  MatProgressBarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule
 } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { SharedModule } from './../../shared/shared.module';


import { RosterStatusTableComponent } from './roster-status/roster-status.table';
import { ShiftDetailPage } from './shift-detail/shift-detail.page';
import { StaffHolistic } from './staff-holistic/staff-holistic.page';
import { ShiftVisualiser } from './shift-visualiser/shift-visualiser.page';

import { RostersRoutes } from "./rosters.routing";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatChipsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatInputModule,
    MatProgressBarModule,
    FlexLayoutModule,
    NgxDatatableModule,
    NgxEchartsModule,
    ChartsModule,
    FileUploadModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    RouterModule.forChild(RostersRoutes)
  ],
  declarations: [
    RosterStatusTableComponent,
    ShiftDetailPage,
    StaffHolistic,
    ShiftVisualiser,
  ],
})
export class RostersModule { }
