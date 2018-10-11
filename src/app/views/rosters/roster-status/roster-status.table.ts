import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RosterStatusService } from '../../../shared/services/data/roster-status.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatDialogRef, MatDialog, MatSnackBar, MatSelectModule } from '@angular/material';
import * as moment from 'moment-timezone';
import { Router } from "@angular/router";

@Component({
  selector: 'roster-status',
  templateUrl: './roster-status.table.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./roster-status.table.css'],
  providers: [RosterStatusService,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})

export class RosterStatusTableComponent implements OnInit {
  daySelect = new FormGroup({
    date: new FormControl()
  })
  staffFilter = new FormGroup({
    staffType: new FormControl()
  })
  constructor(
    private service: RosterStatusService,
    private router: Router,
  ) {}

  staffTypeList = [
    {value:'ALL'},
    {value:'LE'},
    {value:'TM'},
    {value:'PO'},
    {value:'RCTXO'},
    {value:'PL'},
    {value:'SA'}
  ];
  locationList = [
    {value:'ALL'},
    {value:'MAST'},
    {value:'PK'},
    {value:'UH'},
    {value:'WG'},
  ];
  currentFilters= {
    staffType: 'ALL',
    location: 'ALL',
  }

  filter($event) {
    if ($event.source.placeholder == 'staffType'){
      this.currentFilters.staffType = $event.value
    }
    if ($event.source.placeholder == 'location'){
      this.currentFilters.location = $event.value
    }
    console.log(this.currentFilters)
    this.updateTables(this.currentFilters)
  }

  onSubmit() {
    this.service.getCurrentRosterStatus(this.daySelect.value.date)
    .subscribe((response) => {
      this.currentRosterDayStatus = response.currentRosterDayStatus
      this.updateTables(this.currentFilters)
    });
    this.service.getUncoveredShifts(this.daySelect.value.date)
    .subscribe((response) => {
      this.uncoveredShifts = response.uncoveredShifts
      this.updateTables(this.currentFilters)
    });
  }

  showDayRoster(event){
    if (event.type == "click"){
      //console.log(event.row.shiftName)
      let shiftId = event.row.shiftName
      this.router.navigate(['rosters/shift-detail',{shiftId: shiftId}])
    }
  }

  currentRosterDayStatus = []
  filteredRosterDayStatus = []
  uncoveredShifts = []
  filteredUncoveredShifts = []

  unavailabilityBreakdown = {
    sickLeave: 0,
    domesticLeave: 0,
    specialLeave: 0,
    acc: 0,
    berevementLeave: 0,
    parentalLeave: 0,
    alternativeDuties: 0,
    offByRequest: 0,
    standby: 0,
    annualLeave: 0,
    lieuDay: 0,
    longServiceLeave: 0,
    leaveWithoutPay: 0,
    training: 0,
  }

  rosterChart = {
    LE:    [0,0,0,0,0,0],
    TM:    [0,0,0,0,0,0],
    PO:    [0,0,0,0,0,0],
    RCTXO: [0,0,0,0,0,0],
    PL:    [0,0,0,0,0,0],
    SA:    [0,0,0,0,0,0],
  }


  ngOnInit() {
    this.currentFilters = {
      staffType: 'ALL',
      location: 'ALL',
    }
    this.service.getCurrentRosterStatus(moment())
    .subscribe((response) => {
      this.currentRosterDayStatus = response.currentRosterDayStatus
      this.updateTables(this.currentFilters)
    });
    this.service.getUncoveredShifts(moment())
    .subscribe((response) => {
      this.uncoveredShifts = response.uncoveredShifts
      this.updateTables(this.currentFilters)
    });

    this.daySelect = new FormGroup({
      date: new FormControl('', [Validators.required])
    })
    this.staffFilter = new FormGroup({
      staffType: new FormControl()
    })

  }
  updateTables(currentFilters){
    if (currentFilters.staffType !== 'ALL' || currentFilters.location !== 'ALL'){
      if (currentFilters.staffType == 'ALL'){
        this.filteredRosterDayStatus = this.currentRosterDayStatus.filter(area => area.location === currentFilters.location)
        this.filteredUncoveredShifts = this.uncoveredShifts.filter(area => area.location === currentFilters.location)
      } else if (currentFilters.location == 'ALL'){
        this.filteredRosterDayStatus = this.currentRosterDayStatus.filter(area => area.staffType === currentFilters.staffType)
        this.filteredUncoveredShifts = this.uncoveredShifts.filter(area => area.staffType === currentFilters.staffType)
      } else {
        this.filteredRosterDayStatus = this.currentRosterDayStatus.filter(area => area.staffType === currentFilters.staffType && area.location === currentFilters.location)
        this.filteredUncoveredShifts = this.uncoveredShifts.filter(area => area.staffType === currentFilters.staffType && area.location === currentFilters.location)
      }
    } else {
      this.filteredRosterDayStatus = this.currentRosterDayStatus
      this.filteredUncoveredShifts = this.uncoveredShifts
    }
    // reset values
    this.rosterChart = {
      LE:    [0,0,0,0,0,0],
      TM:    [0,0,0,0,0,0],
      PO:    [0,0,0,0,0,0],
      RCTXO: [0,0,0,0,0,0],
      PL:    [0,0,0,0,0,0],
      SA:    [0,0,0,0,0,0],
    }
    this.unavailabilityBreakdown = {
      sickLeave: 0,
      domesticLeave: 0,
      specialLeave: 0,
      acc: 0,
      berevementLeave: 0,
      parentalLeave: 0,
      alternativeDuties: 0,
      offByRequest: 0,
      standby: 0,
      annualLeave: 0,
      lieuDay: 0,
      longServiceLeave: 0,
      leaveWithoutPay: 0,
      training: 0,
    }

    for (let c = 0; c < this.filteredRosterDayStatus.length; c++){
        if (this.filteredRosterDayStatus[c].counterType === 'SL') {this.unavailabilityBreakdown.sickLeave += this.filteredRosterDayStatus[c].count};
        if (this.filteredRosterDayStatus[c].counterType === 'CC') {this.unavailabilityBreakdown.acc += this.filteredRosterDayStatus[c].count};
        if (this.filteredRosterDayStatus[c].counterType === 'SP') {this.unavailabilityBreakdown.specialLeave += this.filteredRosterDayStatus[c].count};
        if (this.filteredRosterDayStatus[c].counterType === 'DOM') {this.unavailabilityBreakdown.domesticLeave += this.filteredRosterDayStatus[c].count};
        if (this.filteredRosterDayStatus[c].counterType === 'PLU') {this.unavailabilityBreakdown.parentalLeave += this.filteredRosterDayStatus[c].count};
        if (this.filteredRosterDayStatus[c].counterType === 'TRN') {this.unavailabilityBreakdown.training += this.filteredRosterDayStatus[c].count};
        if (this.filteredRosterDayStatus[c].counterType === 'TRNG') {this.unavailabilityBreakdown.training += this.filteredRosterDayStatus[c].count};
        if (this.filteredRosterDayStatus[c].counterType === 'AD') {this.unavailabilityBreakdown.alternativeDuties += this.filteredRosterDayStatus[c].count};
        if (this.filteredRosterDayStatus[c].counterType === 'AL') {this.unavailabilityBreakdown.annualLeave += this.filteredRosterDayStatus[c].count};
        if (this.filteredRosterDayStatus[c].counterType === 'LW') {this.unavailabilityBreakdown.leaveWithoutPay += this.filteredRosterDayStatus[c].count};
        if (this.filteredRosterDayStatus[c].counterType === 'LD') {this.unavailabilityBreakdown.lieuDay += this.filteredRosterDayStatus[c].count};
        if (this.filteredRosterDayStatus[c].counterType === 'LS') {this.unavailabilityBreakdown.longServiceLeave += this.filteredRosterDayStatus[c].count};
        //if (this.filteredRosterDayStatus[c].counterType === 'OBR') {this.unavailabilityBreakdown.offByRequest += this.filteredRosterDayStatus[c].count};
    }
    this.doughnutChartData[0] = this.unavailabilityBreakdown.sickLeave
    this.doughnutChartData[1] = this.unavailabilityBreakdown.acc
    this.doughnutChartData[2] = this.unavailabilityBreakdown.specialLeave
    this.doughnutChartData[3] = this.unavailabilityBreakdown.domesticLeave
    this.doughnutChartData[4] = this.unavailabilityBreakdown.alternativeDuties
    this.doughnutChartData[5] = this.unavailabilityBreakdown.parentalLeave
    this.doughnutChartData[6] = this.unavailabilityBreakdown.training
    this.doughnutChartData[7] = this.unavailabilityBreakdown.annualLeave
    this.doughnutChartData[8] = this.unavailabilityBreakdown.leaveWithoutPay
    this.doughnutChartData[9] = this.unavailabilityBreakdown.lieuDay
    this.doughnutChartData[10] = this.unavailabilityBreakdown.longServiceLeave
    //this.doughnutChartData[11] = this.unavailabilityBreakdown.offByRequest


    for (let st = 1; st < this.staffTypeList.length; st++){
      let staffType = this.staffTypeList[st].value
      let dataset = this.currentRosterDayStatus.filter(area => area.staffType === staffType)
        for (let c = 0; c < dataset.length; c++){
          if (['WK'].includes(dataset[c].counterType)){
            this.rosterChart[staffType][1] += dataset[c].count
          }
          if (['ASL', 'ASLE', 'ASLL', 'ESP', 'LSP'].includes(dataset[c].counterType)){
            this.rosterChart[staffType][2] += dataset[c].count
          }
          if (['OFF', 'OFF1E', 'OFF2E', 'OFF1L', 'OFF2L'].includes(dataset[c].counterType)){
            this.rosterChart[staffType][3] += dataset[c].count
          }
          if (['OBR'].includes(dataset[c].counterType)){
            this.rosterChart[staffType][4] += dataset[c].count
          }
          if (['SL', 'CC', 'SP', 'DOM', 'PLU', 'TRN', 'TRNG', 'AD', 'AL', 'LW', 'LD', 'LS'].includes(dataset[c].counterType)){
            this.rosterChart[staffType][5] += dataset[c].count
          }
      }
      //calculate the requirement
      this.rosterChart[staffType][0] = this.rosterChart[staffType][1] + this.uncoveredShifts.filter(area => area.staffType === staffType).length
    }
    

    this.StaffChartData[0].data[0] = this.rosterChart.LE[0]
    this.StaffChartData[1].data[0] = this.rosterChart.LE[1]
    this.StaffChartData[2].data[0] = this.rosterChart.LE[2]
    this.StaffChartData[3].data[0] = this.rosterChart.LE[3]
    this.StaffChartData[4].data[0] = this.rosterChart.LE[4]
    this.StaffChartData[5].data[0] = this.rosterChart.LE[5]
    this.StaffChartData[0].data[1] = this.rosterChart.TM[0]
    this.StaffChartData[1].data[1] = this.rosterChart.TM[1]
    this.StaffChartData[2].data[1] = this.rosterChart.TM[2]
    this.StaffChartData[3].data[1] = this.rosterChart.TM[2]
    this.StaffChartData[4].data[1] = this.rosterChart.TM[4]
    this.StaffChartData[5].data[1] = this.rosterChart.TM[5]
    this.StaffChartData[0].data[2] = this.rosterChart.PO[0]
    this.StaffChartData[1].data[2] = this.rosterChart.PO[1]
    this.StaffChartData[2].data[2] = this.rosterChart.PO[2]
    this.StaffChartData[3].data[2] = this.rosterChart.PO[2]
    this.StaffChartData[4].data[2] = this.rosterChart.PO[4]
    this.StaffChartData[5].data[2] = this.rosterChart.PO[5]
    this.StaffChartData[0].data[3] = this.rosterChart.RCTXO[0]
    this.StaffChartData[1].data[3] = this.rosterChart.RCTXO[1]
    this.StaffChartData[2].data[3] = this.rosterChart.RCTXO[2]
    this.StaffChartData[3].data[3] = this.rosterChart.RCTXO[2]
    this.StaffChartData[4].data[3] = this.rosterChart.RCTXO[4]
    this.StaffChartData[5].data[3] = this.rosterChart.RCTXO[5]
    this.StaffChartData[0].data[4] = this.rosterChart.PL[0]
    this.StaffChartData[1].data[4] = this.rosterChart.PL[1]
    this.StaffChartData[2].data[4] = this.rosterChart.PL[2]
    this.StaffChartData[3].data[4] = this.rosterChart.PL[2]
    this.StaffChartData[4].data[4] = this.rosterChart.PL[4]
    this.StaffChartData[5].data[4] = this.rosterChart.PL[5]
    this.StaffChartData[0].data[5] = this.rosterChart.SA[0]
    this.StaffChartData[1].data[5] = this.rosterChart.SA[1]
    this.StaffChartData[2].data[5] = this.rosterChart.SA[2]
    this.StaffChartData[3].data[5] = this.rosterChart.SA[2]
    this.StaffChartData[4].data[5] = this.rosterChart.SA[4]
    this.StaffChartData[5].data[5] = this.rosterChart.SA[5]
    // fixes the refresh issue
    let clone1 = JSON.parse(JSON.stringify(this.StaffChartData));
    this.StaffChartData = clone1;
    let clone2 = JSON.parse(JSON.stringify(this.doughnutChartData));
    this.doughnutChartData = clone2;
  }

  StaffChartColors: Array <any> = [{
    backgroundColor: '#4363d8',
    borderColor: '#3f51b5',
    pointBackgroundColor: '#3f51b5',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }, {
    backgroundColor: '#eeeeee',
    borderColor: '#3f51b5',
    pointBackgroundColor: '#3f51b5',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }, {
    backgroundColor: '#97c475',
    borderColor: '#e0e0e0',
    pointBackgroundColor: '#e0e0e0',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(77,83,96,1)'
  }, {
    backgroundColor: '#a8a8a8',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }, {
    backgroundColor: '#808080',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }, {
    backgroundColor: '#ff8080',
    borderColor: '#e0e0e0',
    pointBackgroundColor: '#e0e0e0',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(77,83,96,1)'
  }];
  /*
  * Staff Chart
  */
 StaffChartLabels: string[] = ['Locomotive Engineer', 'Train Manager', 'Passenger Operator', 'RCO & TXO', 'SCC', 'Sales'];
 StaffChartType = 'horizontalBar';
 StaffChartLegend = true;
 StaffChartData: any[] = [{
  data: [0,0,0,0,0,0],
   label: 'Staffing Requirement',
   borderWidth: 0,
   stack: 'A',
 },{
  data: [0,0,0,0,0,0],
   label: 'Working',
   borderWidth: 0,
   stack: 'B',
 }, {
  data: [0,0,0,0,0,0],
   label: 'Available',
   borderWidth: 0,
   stack: 'B',
 }, {
  data: [0,0,0,0,0,0],
  label: 'Off',
  borderWidth: 0,
  stack: 'C',
}, {
  data: [0,0,0,0,0,0],
  label: 'Off by request',
  borderWidth: 0,
  stack: 'C',
}, {
  data: [0,0,0,0,0,0],
  label: 'Unvailable',
  borderWidth: 0,
  stack: 'D',
}];
StaffChartOptions: any = Object.assign({
   scaleShowVerticalLines: true,
   scales: {
     xAxes: [{
      stacked: true,
       gridLines: {
         color: 'rgba(0,0,0,0.02)',
         zeroLineColor: 'rgba(0,0,0,0.02)'
       },
       ticks: {
        fontColor: "white",
       }
     }],
     yAxes: [{
      stacked: true,
       gridLines: {
         color: 'rgba(0,0,0,0.02)',
         zeroLineColor: 'rgba(0,0,0,0.02)'
       },
       ticks: {
        fontColor: "white",
       }
     }],
   },
   responsive: true,
   maintainAspectRatio: true,
   legend: {
     display: true,
     position: 'top',
     labels: {
      fontColor: "white",
  }
   }
 });
  // All Staff Chart
  doughnutChartColors: any[] = [{
    backgroundColor: ['#e6194b', '#9A6324', '#f58231', '#ffe119', '#bfef45', '#3cb44b', '#42d4f4', '#4363d8', '#911eb4', '#000075', '#469990', '#a9a9a9']
  }];
  doughnutChartLabels: string[] = ['Sick', 'ACC', 'Special', 'Domestic', 'Alt Duties', 'Parental Leave', 'Training', 'Annual Leave', 'Leave Without Pay', 'Lieu Day', 'Long Service'];
  doughnutChartData: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  doughnutChartType = 'doughnut';
  doughnutOptions: any = Object.assign({
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      display: true,
      position: 'right',
      labels: {
       fontColor: "white",
   }
    }
  });
   /*
  * Bar Chart Event Handler
  */
 public barChartClicked(e: any): void {
}
public barChartHovered(e: any): void {
}
  /*
  * Doughnut Chart Event Handler
  */
 public doughnutChartClicked(e: any): void {
}
public doughnutChartHovered(e: any): void {
}
}
