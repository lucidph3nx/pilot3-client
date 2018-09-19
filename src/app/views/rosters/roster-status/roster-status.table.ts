import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RosterStatusService } from '../../../shared/services/data/roster-status.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import * as moment from 'moment-timezone';


@Component({
  selector: 'roster-status',
  templateUrl: './roster-status.table.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./roster-status.table.css'],
  providers: [RosterStatusService],
})
export class RosterStatusTableComponent implements OnInit {
  constructor(
    private service: RosterStatusService,
  ) {}

  currentRosterDayStatus = []
  LE = []
  TM = []
  PO = []
  RCTXO = []
  PL = []
  SA = []

  rosterChart = {
    LE: {
      working: 0,
      available: 0,
      rest: 0,
      unavailable: 0
    },
    TM: {
      working: 0,
      available: 0,
      rest: 0,
      unavailable: 0
    },
    PO: {
      working: 0,
      available: 0,
      rest: 0,
      unavailable: 0
    },
    RCTXO: {
      working: 0,
      available: 0,
      rest: 0,
      unavailable: 0
    },
    PL: {
      working: 0,
      available: 0,
      rest: 0,
      unavailable: 0
    },
    SA: {
      working: 0,
      available: 0,
      rest: 0,
      unavailable: 0
    },
    ALL: {
      working: 0,
      available: 0,
      rest: 0,
      unavailable: 0
    }
  }

  workTypes = ['WK',]
  availableTypes = ['ASL', 'ASLE', 'ASLL', 'ESP', 'LSP']
  restTypes = ['OFF', 'OFF1E', 'OFF2E', 'OFF1L', 'OFF2L']
  unavailableTypes = ['SL', 'CC', 'SP', 'DOM', 'PLU', 'TRNG', 'AD', 'AL', 'LW', 'LD', 'LS', 'OBR']

  ngOnInit() {
    this.service.getCurrentRosterStatus()
    .subscribe((response) => {
      this.currentRosterDayStatus = response.currentRosterDayStatus
      this.updateTables()
    });
  }
  updateTables(){
    console.log('updated chart')
    // reset values
    this.rosterChart = {
      LE: {
        working: 0,
        available: 0,
        rest: 0,
        unavailable: 0
      },
      TM: {
        working: 0,
        available: 0,
        rest: 0,
        unavailable: 0
      },
      PO: {
        working: 0,
        available: 0,
        rest: 0,
        unavailable: 0
      },
      RCTXO: {
        working: 0,
        available: 0,
        rest: 0,
        unavailable: 0
      },
      PL: {
        working: 0,
        available: 0,
        rest: 0,
        unavailable: 0
      },
      SA: {
        working: 0,
        available: 0,
        rest: 0,
        unavailable: 0
      },
      ALL: {
        working: 0,
        available: 0,
        rest: 0,
        unavailable: 0
      }
    }

    for (let c = 0; c < this.currentRosterDayStatus.length; c++){
      if (this.workTypes.includes(this.currentRosterDayStatus[c].counterType)){
        this.rosterChart.ALL.working += this.currentRosterDayStatus[c].count
      }
      if (this.availableTypes.includes(this.currentRosterDayStatus[c].counterType)){
        this.rosterChart.ALL.available += this.currentRosterDayStatus[c].count
      }
      if (this.restTypes.includes(this.currentRosterDayStatus[c].counterType)){
        this.rosterChart.ALL.rest += this.currentRosterDayStatus[c].count
      }
      if (this.unavailableTypes.includes(this.currentRosterDayStatus[c].counterType)){
        this.rosterChart.ALL.unavailable += this.currentRosterDayStatus[c].count
      }
    }
    this.doughnutChartData[0] = this.rosterChart.ALL.working
    this.doughnutChartData[1] = this.rosterChart.ALL.available
    this.doughnutChartData[2] = this.rosterChart.ALL.rest
    this.doughnutChartData[3] = this.rosterChart.ALL.unavailable

    this.LE = this.currentRosterDayStatus.filter(area => area.staffType === 'LE')
    this.TM = this.currentRosterDayStatus.filter(area => area.staffType === 'TM')
    this.PO = this.currentRosterDayStatus.filter(area => area.staffType === 'PO')
    this.RCTXO = this.currentRosterDayStatus.filter(area => area.staffType === 'RCTXO')
    this.PL = this.currentRosterDayStatus.filter(area => area.staffType === 'PL')
    this.SA = this.currentRosterDayStatus.filter(area => area.staffType === 'SA')
    
    for (let c = 0; c < this.LE.length; c++){
      if (this.workTypes.includes(this.LE[c].counterType)){
        this.rosterChart.LE.working += this.LE[c].count
      }
      if (this.availableTypes.includes(this.LE[c].counterType)){
        this.rosterChart.LE.available += this.LE[c].count
      }
      if (this.restTypes.includes(this.LE[c].counterType)){
        this.rosterChart.LE.rest += this.LE[c].count
      }
      if (this.unavailableTypes.includes(this.LE[c].counterType)){
        this.rosterChart.LE.unavailable += this.LE[c].count
      }
    }
    for (let c = 0; c < this.TM.length; c++){
      if (this.workTypes.includes(this.TM[c].counterType)){
        this.rosterChart.TM.working += this.TM[c].count
      }
      if (this.availableTypes.includes(this.TM[c].counterType)){
        this.rosterChart.TM.available += this.TM[c].count
      }
      if (this.restTypes.includes(this.TM[c].counterType)){
        this.rosterChart.TM.rest += this.TM[c].count
      }
      if (this.unavailableTypes.includes(this.TM[c].counterType)){
        this.rosterChart.TM.unavailable += this.TM[c].count
      }
    }
    for (let c = 0; c < this.PO.length; c++){
      if (this.workTypes.includes(this.PO[c].counterType)){
        this.rosterChart.PO.working += this.PO[c].count
      }
      if (this.availableTypes.includes(this.PO[c].counterType)){
        this.rosterChart.PO.available += this.PO[c].count
      }
      if (this.restTypes.includes(this.PO[c].counterType)){
        this.rosterChart.PO.rest += this.PO[c].count
      }
      if (this.unavailableTypes.includes(this.PO[c].counterType)){
        this.rosterChart.PO.unavailable += this.PO[c].count
      }
    }
    for (let c = 0; c < this.RCTXO.length; c++){
      if (this.workTypes.includes(this.RCTXO[c].counterType)){
        this.rosterChart.RCTXO.working += this.RCTXO[c].count
      }
      if (this.availableTypes.includes(this.RCTXO[c].counterType)){
        this.rosterChart.RCTXO.available += this.RCTXO[c].count
      }
      if (this.restTypes.includes(this.RCTXO[c].counterType)){
        this.rosterChart.RCTXO.rest += this.RCTXO[c].count
      }
      if (this.unavailableTypes.includes(this.RCTXO[c].counterType)){
        this.rosterChart.RCTXO.unavailable += this.RCTXO[c].count
      }
    }
    for (let c = 0; c < this.PL.length; c++){
      if (this.workTypes.includes(this.PL[c].counterType)){
        this.rosterChart.PL.working += this.PL[c].count
      }
      if (this.availableTypes.includes(this.PL[c].counterType)){
        this.rosterChart.PL.available += this.PL[c].count
      }
      if (this.restTypes.includes(this.PL[c].counterType)){
        this.rosterChart.PL.rest += this.PL[c].count
      }
      if (this.unavailableTypes.includes(this.PL[c].counterType)){
        this.rosterChart.PL.unavailable += this.PL[c].count
      }
    }
    for (let c = 0; c < this.SA.length; c++){
      if (this.workTypes.includes(this.SA[c].counterType)){
        this.rosterChart.SA.working += this.SA[c].count
      }
      if (this.availableTypes.includes(this.SA[c].counterType)){
        this.rosterChart.SA.available += this.SA[c].count
      }
      if (this.restTypes.includes(this.SA[c].counterType)){
        this.rosterChart.SA.rest += this.SA[c].count
      }
      if (this.unavailableTypes.includes(this.SA[c].counterType)){
        this.rosterChart.SA.unavailable += this.SA[c].count
      }
    }
    this.StaffChartData[0].data[0] = this.rosterChart.LE.working
    this.StaffChartData[1].data[0] = this.rosterChart.LE.available
    this.StaffChartData[2].data[0] = this.rosterChart.LE.rest
    this.StaffChartData[3].data[0] = this.rosterChart.LE.unavailable
    this.StaffChartData[0].data[1] = this.rosterChart.TM.working
    this.StaffChartData[1].data[1] = this.rosterChart.TM.available
    this.StaffChartData[2].data[1] = this.rosterChart.TM.rest
    this.StaffChartData[3].data[1] = this.rosterChart.TM.unavailable
    this.StaffChartData[0].data[2] = this.rosterChart.PO.working
    this.StaffChartData[1].data[2] = this.rosterChart.PO.available
    this.StaffChartData[2].data[2] = this.rosterChart.PO.rest
    this.StaffChartData[3].data[2] = this.rosterChart.PO.unavailable
    this.StaffChartData[0].data[3] = this.rosterChart.RCTXO.working
    this.StaffChartData[1].data[3] = this.rosterChart.RCTXO.available
    this.StaffChartData[2].data[3] = this.rosterChart.RCTXO.rest
    this.StaffChartData[3].data[3] = this.rosterChart.RCTXO.unavailable
    this.StaffChartData[0].data[4] = this.rosterChart.PL.working
    this.StaffChartData[1].data[4] = this.rosterChart.PL.available
    this.StaffChartData[2].data[4] = this.rosterChart.PL.rest
    this.StaffChartData[3].data[4] = this.rosterChart.PL.unavailable
    this.StaffChartData[0].data[5] = this.rosterChart.SA.working
    this.StaffChartData[1].data[5] = this.rosterChart.SA.available
    this.StaffChartData[2].data[5] = this.rosterChart.SA.rest
    this.StaffChartData[3].data[5] = this.rosterChart.SA.unavailable
    // fixes the refresh issue
    let clone1 = JSON.parse(JSON.stringify(this.StaffChartData));
    this.StaffChartData = clone1;
    let clone2 = JSON.parse(JSON.stringify(this.doughnutChartData));
    this.doughnutChartData = clone2;
  }

  sharedChartOptions: any = {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      display: false,
      position: 'bottom'
    }
  };
  chartColors: Array <any> = [{
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
 StaffChartType = 'bar';
 StaffChartLegend = true;
 StaffChartData: any[] = [{
  data: [0,0,0,0,0,0],
   label: 'Working',
   borderWidth: 0
 }, {
  data: [0,0,0,0,0,0],
   label: 'Available',
   borderWidth: 0
 }, {
  data: [0,0,0,0,0,0],
  label: 'Rest',
  borderWidth: 0
}, {
  data: [0,0,0,0,0,0],
  label: 'Unvailable',
  borderWidth: 0
}];
 barChartOptions: any = Object.assign({
   scaleShowVerticalLines: true,
   scales: {
     xAxes: [{
       gridLines: {
         color: 'rgba(0,0,0,0.02)',
         zeroLineColor: 'rgba(0,0,0,0.02)'
       }
     }],
     yAxes: [{
       gridLines: {
         color: 'rgba(0,0,0,0.02)',
         zeroLineColor: 'rgba(0,0,0,0.02)'
       },
       position: 'left',
       ticks: {
         beginAtZero: true,
         min: 0
       }
     }]
   }
 }, this.sharedChartOptions);
  // All Staff Chart
  doughnutChartColors: any[] = [{
    backgroundColor: ['#eeeeee', '#97c475', '#808080', '#ff8080']
  }];
  doughnutChartLabels: string[] = ['Working', 'Available', 'Rest', 'unavailable'];
  doughnutChartData: number[] = [0, 0, 0, 0];
  doughnutChartType = 'doughnut';
  doughnutOptions: any = Object.assign({
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  }, this.sharedChartOptions);
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
