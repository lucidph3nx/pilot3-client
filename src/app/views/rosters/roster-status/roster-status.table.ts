import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RosterService } from '../../../shared/services/data/roster.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MatDialog, MatSnackBar, MatSelectModule } from '@angular/material';
import * as moment from 'moment-timezone';
import { Router } from "@angular/router";

@Component({
  selector: 'roster-status',
  templateUrl: './roster-status.table.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./roster-status.table.css'],
  providers: [RosterService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
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
    private service: RosterService,
    private router: Router,
  ) { }

  staffTypeList = [
    { value: 'ALL' },
    { value: 'LE' },
    { value: 'TM' },
    { value: 'PO' },
    { value: 'RCTXO' },
    { value: 'PL' },
    { value: 'SA' }
  ];
  locationList = [
    { value: 'ALL' },
    { value: 'MAST' },
    { value: 'PK' },
    { value: 'UH' },
    { value: 'WG' },
  ];
  currentFilters = {
    staffType: 'ALL',
    location: 'ALL',
  }

  filter($event) {
    if ($event.source.placeholder == 'staffType') {
      this.currentFilters.staffType = $event.value
    }
    if ($event.source.placeholder == 'location') {
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

  showDayRoster(event) {
    if (event.type == "click") {
      //console.log(event.row.shiftName)
      let shiftId = event.row.shiftName
      this.router.navigate(['rosters/shift-detail', { shiftId: shiftId }])
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
    standby: 0,
    annualLeave: 0,
    lieuDay: 0,
    longServiceLeave: 0,
    leaveWithoutPay: 0,
    training: 0,
  }

  rosterChart = {
    LE: [0, 0, 0, 0, 0, 0],
    TM: [0, 0, 0, 0, 0, 0],
    PO: [0, 0, 0, 0, 0, 0],
    RCTXO: [0, 0, 0, 0, 0, 0],
    PL: [0, 0, 0, 0, 0, 0],
    SA: [0, 0, 0, 0, 0, 0],
  }


  unavailabilityBreakdownChart: any;
  updateUnavailabilityBreakdownChart: any;

  rosterGroupsChart: any;
  updateRosterGroupsChart: any;

  ngOnInit() {
    this.unavailabilityBreakdownChart = {
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      color: [
        '#e6194b',
        '#9A6324',
        '#f58231',
        '#ffe119',
        '#bfef45',
        '#3cb44b',
        '#42d4f4',
        '#4363d8',
        '#911eb4',
        '#000075',
        '#469990',
        '#a9a9a9',
      ],
      tooltip: {
        show: false,
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        textStyle: {
          color: 'rgba(256,256,256,1)'
        },
        x: 'right',
        //y: 'bottom',
        orient: 'vertical',
        position: 'right',
        data: ['Sick', 'ACC', 'Special', 'Domestic', 'Alt Duties', 'Parental Leave', 'Training', 'Annual Leave', 'leave Without Pay', 'lieu Day', 'Long Service']
      },
      xAxis: [
        {
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: "Unavailability Breakdown",
          type: "pie",
          //radius: [30, 110],
          //roseType: 'radius',
          radius: ["55%", "85%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          hoverOffset: 5,
          stillShowZeroSum: false,
          label: {
            normal: {
              show: false,
              position: "center",
              textStyle: {
                fontSize: "13",
                fontWeight: "normal"
              },
              formatter: "{a}"
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: "15",
                fontWeight: "normal",
                color: "rgba(256, 256, 256, 1)"
              },
              formatter: "{b} \n{c} ({d}%)"
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: []/*[
            { value: 1, name: "Sick" },
            { value: 2, name: "ACC" },
            { value: 3, name: "Special" }
          ]*/,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
    this.rosterGroupsChart = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        textStyle: {
          color: 'rgba(256,256,256,1)'
        },
        data: ['Staffing Requirement', 'Working', 'Available', 'Off', 'Off by request', 'Unavailable'],
      },
      grid: {
        left: 100
      },
      xAxis: {
        type: 'value',
        name: 'Staff',
        interval: 10,
        nameTextStyle: {
          color: 'rgba(256,256,256,1)',
        },
        axisLabel: {
          //formatter: '{value}',
          color: 'rgba(256,256,256,1)',
        }
      },
      yAxis: {
        type: 'category',
        inverse: true,
        axisLabel: {
          color: 'rgba(256,256,256,1)',
        },
        data: ['LE', 'TM', 'PO', 'RCO & TXO', 'SCC', 'Sales'],
      },
      color: [
        '#4363d8',
        '#eeeeee',
        '#97c475',
        '#a8a8a8',
        '#808080',
        '#ff8080',
      ],
      series: [
      ]
    };

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
  updateTables(currentFilters) {
    if (currentFilters.staffType !== 'ALL' || currentFilters.location !== 'ALL') {
      if (currentFilters.staffType == 'ALL') {
        this.filteredRosterDayStatus = this.currentRosterDayStatus.filter(area => area.location === currentFilters.location)
        this.filteredUncoveredShifts = this.uncoveredShifts.filter(area => area.location === currentFilters.location)
      } else if (currentFilters.location == 'ALL') {
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
      LE: [0, 0, 0, 0, 0, 0],
      TM: [0, 0, 0, 0, 0, 0],
      PO: [0, 0, 0, 0, 0, 0],
      RCTXO: [0, 0, 0, 0, 0, 0],
      PL: [0, 0, 0, 0, 0, 0],
      SA: [0, 0, 0, 0, 0, 0],
    }
    this.unavailabilityBreakdown = {
      sickLeave: 0,
      domesticLeave: 0,
      specialLeave: 0,
      acc: 0,
      berevementLeave: 0,
      parentalLeave: 0,
      alternativeDuties: 0,
      standby: 0,
      annualLeave: 0,
      lieuDay: 0,
      longServiceLeave: 0,
      leaveWithoutPay: 0,
      training: 0,
    }

    for (let c = 0; c < this.filteredRosterDayStatus.length; c++) {
      if (this.filteredRosterDayStatus[c].counterType === 'SL') { this.unavailabilityBreakdown.sickLeave += this.filteredRosterDayStatus[c].count };
      if (this.filteredRosterDayStatus[c].counterType === 'CC') { this.unavailabilityBreakdown.acc += this.filteredRosterDayStatus[c].count };
      if (this.filteredRosterDayStatus[c].counterType === 'SP') { this.unavailabilityBreakdown.specialLeave += this.filteredRosterDayStatus[c].count };
      if (this.filteredRosterDayStatus[c].counterType === 'DOM') { this.unavailabilityBreakdown.domesticLeave += this.filteredRosterDayStatus[c].count };
      if (this.filteredRosterDayStatus[c].counterType === 'PLU') { this.unavailabilityBreakdown.parentalLeave += this.filteredRosterDayStatus[c].count };
      if (this.filteredRosterDayStatus[c].counterType === 'TRN') { this.unavailabilityBreakdown.training += this.filteredRosterDayStatus[c].count };
      if (this.filteredRosterDayStatus[c].counterType === 'TRNG') { this.unavailabilityBreakdown.training += this.filteredRosterDayStatus[c].count };
      if (this.filteredRosterDayStatus[c].counterType === 'AD') { this.unavailabilityBreakdown.alternativeDuties += this.filteredRosterDayStatus[c].count };
      if (this.filteredRosterDayStatus[c].counterType === 'AL') { this.unavailabilityBreakdown.annualLeave += this.filteredRosterDayStatus[c].count };
      if (this.filteredRosterDayStatus[c].counterType === 'LW') { this.unavailabilityBreakdown.leaveWithoutPay += this.filteredRosterDayStatus[c].count };
      if (this.filteredRosterDayStatus[c].counterType === 'LD') { this.unavailabilityBreakdown.lieuDay += this.filteredRosterDayStatus[c].count };
      if (this.filteredRosterDayStatus[c].counterType === 'LS') { this.unavailabilityBreakdown.longServiceLeave += this.filteredRosterDayStatus[c].count };
    }
    this.updateUnavailabilityBreakdownChart = {
      series: [
        {
          data: [
            { name: 'Sick', value: this.unavailabilityBreakdown.sickLeave },
            { name: 'ACC', value: this.unavailabilityBreakdown.acc },
            { name: 'Special', value: this.unavailabilityBreakdown.specialLeave },
            { name: 'Domestic', value: this.unavailabilityBreakdown.domesticLeave },
            { name: 'Alt Duties', value: this.unavailabilityBreakdown.alternativeDuties },
            { name: 'Parental Leave', value: this.unavailabilityBreakdown.parentalLeave },
            { name: 'Training', value: this.unavailabilityBreakdown.training },
            { name: 'Annual Leave', value: this.unavailabilityBreakdown.annualLeave },
            { name: 'leave Without Pay', value: this.unavailabilityBreakdown.leaveWithoutPay },
            { name: 'lieu Day', value: this.unavailabilityBreakdown.lieuDay },
            { name: 'Long Service', value: this.unavailabilityBreakdown.longServiceLeave },
          ]
        },
      ],
    }

    for (let st = 1; st < this.staffTypeList.length; st++) {
      let staffType = this.staffTypeList[st].value
      let dataset = this.currentRosterDayStatus.filter(area => area.staffType === staffType)
      for (let c = 0; c < dataset.length; c++) {
        if (['WK'].includes(dataset[c].counterType)) {
          this.rosterChart[staffType][1] += dataset[c].count
        }
        if (['ASL', 'ASLE', 'ASLL', 'ESP', 'LSP'].includes(dataset[c].counterType)) {
          this.rosterChart[staffType][2] += dataset[c].count
        }
        if (['OFF', 'OFF1E', 'OFF2E', 'OFF1L', 'OFF2L'].includes(dataset[c].counterType)) {
          this.rosterChart[staffType][3] += dataset[c].count
        }
        if (['OBR'].includes(dataset[c].counterType)) {
          this.rosterChart[staffType][4] += dataset[c].count
        }
        if (['SL', 'CC', 'SP', 'DOM', 'PLU', 'TRN', 'TRNG', 'AD', 'AL', 'LW', 'LD', 'LS'].includes(dataset[c].counterType)) {
          this.rosterChart[staffType][5] += dataset[c].count
        }
      }
      //calculate the requirement
      this.rosterChart[staffType][0] = this.rosterChart[staffType][1] + this.uncoveredShifts.filter(area => area.staffType === staffType).length
    }

    console.log(this.rosterChart);

    this.updateRosterGroupsChart = {
      series: [
        {
          name: 'Staffing Requirement',
          type: 'bar',
          stack: 'A',
          data: [
            this.rosterChart.LE[0],
            this.rosterChart.TM[0],
            this.rosterChart.PO[0],
            this.rosterChart.RCTXO[0],
            this.rosterChart.PL[0],
            this.rosterChart.SA[0],
          ],
        },
        {
          name: 'Working',
          type: 'bar',
          stack: 'B',
          data: [
            this.rosterChart.LE[1],
            this.rosterChart.TM[1],
            this.rosterChart.PO[1],
            this.rosterChart.RCTXO[1],
            this.rosterChart.PL[1],
            this.rosterChart.SA[1],
          ],
        },
        {
          name: 'Available',
          type: 'bar',
          stack: 'B',
          data: [
            this.rosterChart.LE[2],
            this.rosterChart.TM[2],
            this.rosterChart.PO[2],
            this.rosterChart.RCTXO[2],
            this.rosterChart.PL[2],
            this.rosterChart.SA[2],
          ],
        },
        {
          name: 'Off',
          type: 'bar',
          stack: 'C',
          data: [
            this.rosterChart.LE[3],
            this.rosterChart.TM[3],
            this.rosterChart.PO[3],
            this.rosterChart.RCTXO[3],
            this.rosterChart.PL[3],
            this.rosterChart.SA[3],
          ],
        },
        {
          name: 'Off by request',
          type: 'bar',
          stack: 'C',
          data: [
            this.rosterChart.LE[4],
            this.rosterChart.TM[4],
            this.rosterChart.PO[4],
            this.rosterChart.RCTXO[4],
            this.rosterChart.PL[4],
            this.rosterChart.SA[4],
          ],
        },
        {
          name: 'Unvailable',
          type: 'bar',
          stack: 'D',
          data: [
            this.rosterChart.LE[5],
            this.rosterChart.TM[5],
            this.rosterChart.PO[5],
            this.rosterChart.RCTXO[5],
            this.rosterChart.PL[5],
            this.rosterChart.SA[5],
          ],
        },
      ]
    }
  }
}
