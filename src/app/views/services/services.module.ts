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
  MatSelectModule,
 } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { SharedModule } from '../../shared/shared.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { CurrentServicesTableComponent } from './current-services/current-services.table';
import { MatangiUnitsTableComponent } from './matangi-units/matangi-units.table';
import { ServicesRoutes } from "./services.routing";
import { serviceViewComponent } from "./current-services/service-view/service-view.component"
import { ServiceDetailComponent } from './service-detail/service-detail.page';
import { TimeDistanceComponent } from './time-distance/time-distance.page';
import { NotInServiceTableComponent } from './not-in-service/not-in-service.table';


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
    ChartsModule,
    FileUploadModule,
    SharedModule,
    MatDatepickerModule,
    MatSelectModule,
    NgxEchartsModule,
    RouterModule.forChild(ServicesRoutes)
  ],
  declarations: [
    CurrentServicesTableComponent,
    MatangiUnitsTableComponent,
    serviceViewComponent,
    ServiceDetailComponent,
    TimeDistanceComponent,
    NotInServiceTableComponent,
  ],
  entryComponents: [serviceViewComponent]
})
export class ServicesModule { }
