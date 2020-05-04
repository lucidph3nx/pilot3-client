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
  MatSelectModule,
  MatButtonToggleModule,
 } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { SharedModule } from './../../shared/shared.module';


import { RosterStatusTableComponent } from './roster-status/roster-status.table';
import { AvailableLeaveTableComponent } from './available-leave/available-leave.table';
import { ShiftDetailPage } from './shift-detail/shift-detail.page';
import { StaffHolistic } from './staff-holistic/staff-holistic.page';
import { ShiftVisualiser } from './shift-visualiser/shift-visualiser.page';
import { StaffVisualiser } from './staff-visualiser/staff-visualiser.page';

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
    MatButtonToggleModule,
    RouterModule.forChild(RostersRoutes)
  ],
  declarations: [
    RosterStatusTableComponent,
    AvailableLeaveTableComponent,
    ShiftDetailPage,
    StaffHolistic,
    ShiftVisualiser,
    StaffVisualiser,
  ],
})
export class RostersModule { }
