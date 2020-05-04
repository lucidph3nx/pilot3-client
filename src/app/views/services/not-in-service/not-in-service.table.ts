import { Component, OnInit, OnDestroy, ViewEncapsulation, EventEmitter, Output, Injectable } from '@angular/core';
import { egretAnimations } from "app/shared/animations/egret-animations";
import { UnitListService } from '../../../shared/services/data/unit-list.service';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import * as moment from 'moment-timezone';
import * as echarts from 'echarts';
import 'core-js/es7/string';

@Component({
  selector: 'not-in-service',
  templateUrl: './not-in-service.table.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./not-in-service.table.css'],
  providers: [UnitListService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  animations: egretAnimations,
})
@Injectable()
export class NotInServiceTableComponent implements OnInit {

  dateSelect = new FormGroup({
    date: new FormControl()
  })

  constructor(
    private service: UnitListService,
    public dialog: MatDialog,    
  ) {}
  private fleetSubscription;
  NISList = [];
  tableNIS = []
  tableRestricted = []
  matangiNISCount = 0;
  matangiRestrictedCount = 0;
  matangiSLA = 83 - this.matangiNISCount;
  timeUpdated = ''

  dateNIS: any;
  graphNIS: any;
  updateGraphNIS: any;
  historicNISList = [];
  historicNISGraph = [];

  updateTable(){
    this.NISList.forEach(unit => {
      unit.reportedDate = moment(unit.reportedDate).format('YYYY-MM-DD HH:mm:ss')
    });
    this.tableNIS = this.NISList.filter(unit => unit.NIS === true);
    this.tableRestricted = this.NISList.filter(unit => unit.NIS === false);
    let matangiRestricted = this.tableRestricted.filter(unit => unit.matangi === true);
    this.matangiRestrictedCount = matangiRestricted.length
  }

  updateNISHistoricData() {
    this.dateNIS = moment(this.dateSelect.value.date)
    this.fleetSubscription = this.service.getHistoricNIS(this.dateNIS)
    .subscribe((response) => {
      this.historicNISList = response.dayNISList
      this.historicNISList.forEach(unit => {
        unit.reportedDate = moment(unit.reportedDate).format('YYYY-MM-DD HH:mm:ss')
        unit.updatedDate = moment(unit.updatedDate).format('YYYY-MM-DD HH:mm:ss')
      });
      this.historicNISGraph = response.graphNISData;
      this.updateNISChart();
    });
  }

  ngOnInit() {
    this.fleetSubscription = this.service.getCurrentNISList()
    .subscribe((response) => {
      this.NISList = response.currentNISList
      this.matangiNISCount = response.matangiNISCount;
      this.matangiSLA = 83 - this.matangiNISCount;
      this.timeUpdated = moment(response.Time).format('HH:mm:ss');
      this.updateTable();
    });
  }
  ngOnDestroy(){
    this.fleetSubscription.unsubscribe();
  }

  initialiseCharts(){
    this.graphNIS = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params) {
          let response = '';
          for (let i = 0; i < params.length; i++) {
            if (params[i].data.name !== undefined) {
              response = response + params[i].data.name + " <br/> "
            }
          }
          return response
        }
      },
      xAxis: {
        name: 'Time',
        nameLocation: 'center',
        nameTextStyle: {
          color: '#ffffff',
        },
        nameGap: 30,
        type: 'time',
        axisLabel: {
          color: '#ffffff',
        },
        maxInterval: 3600 * 1000,
      },
      yAxis: {
        name: 'Available',
        nameLocation: 'center',
        nameTextStyle: {
          color: '#ffffff',
        },
        nameGap: 50,
        nameRotate: 90,
        type: 'value',
        axisLabel: {
          color: '#ffffff',
        },
      },
      series: []
    };
  }

  updateNISChart(){
    let series = []
    let dataPrimary = []
    let yMax = 83
    let yMin = 73
    
    for (let i = 0; i < this.historicNISGraph.length; i++) {
      if (yMax < this.historicNISGraph[i].available){ yMax = this.historicNISGraph[i].available}
      if (yMin > this.historicNISGraph[i].available){ yMin = this.historicNISGraph[i].available}
      dataPrimary.push({
        name: moment(this.historicNISGraph[i].dateTime).format('HH:mm') + ' - ' + this.historicNISGraph[i].available + ' available',
        value: [this.historicNISGraph[i].dateTime, this.historicNISGraph[i].available],
      })
    }
    //reset chart
    this.initialiseCharts()
    //push the primary series
    series.push({
      data: dataPrimary,
      type: 'line',
    })
    this.updateGraphNIS = {
      xAxis: {
        min: this.historicNISGraph[0].dateTime,
        max: this.historicNISGraph[this.historicNISGraph.length - 1].dateTime,
      },
      yAxis: {
        min: yMax,
        max: yMin,
      },
      series: series
    };
    console.log(this.updateGraphNIS)
  }
}