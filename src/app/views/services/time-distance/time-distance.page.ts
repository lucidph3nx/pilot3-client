import { Component, OnInit, OnDestroy, ViewEncapsulation, EventEmitter, Output, Injectable } from '@angular/core';
import { egretAnimations } from "app/shared/animations/egret-animations";
import { ServicesService } from '../../../shared/services/data/services.service';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';
import 'core-js/es7/string';
import { environment } from '../../../../environments/environment';
import { MinMaxDatepickerComponent } from 'assets/examples/material/min-max-datepicker/min-max-datepicker.component';

@Component({
  selector: 'time-distance',
  templateUrl: './time-distance.page.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./time-distance.page.css'],
  providers: [ServicesService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  animations: egretAnimations,
})
@Injectable()
export class TimeDistanceComponent implements OnInit {

  timeDistanceSelect = new FormGroup({
    date: new FormControl(),
    lineId: new FormControl(),
  })

  constructor(
    private service: ServicesService,
    private route: ActivatedRoute
  ) { }
  private serviceSubscription;
  private routeParamsSubscription;
  lineId = '';
  date = '';
  dateLineSelected = false;
  timeDistancePoints = [];
  lineList = [
    { value: 'NIMT' },
    { value: 'WRAPA' },
    { value: 'MLING' },
    { value: 'JVILL' },
  ];

  timeDistanceChart: any;
  updateTimeDistanceChart: any;



  updateData() {
    this.date = moment(this.timeDistanceSelect.value.date).format('YYYYMMDD')
    this.lineId = this.timeDistanceSelect.value.lineId
    this.getTimeDistancePoints()
  }

  getTimeDistancePoints() {
    this.serviceSubscription = this.service.getTimeDistance(this.date, this.lineId)
      .subscribe((response) => {

        if (response.timeDistance.date !== undefined) {
          this.dateLineSelected = true;
          this.timeDistancePoints = response.timeDistance.timeDistancePoints

          let series = []
          let data = []
          let currentServiceId = this.timeDistancePoints[0].serviceId
          let min = Number(moment(this.date).add(1, 'days').format('X'));
          let max = Number(moment(this.date).format('X'));
          for (let i = 0; i < this.timeDistancePoints.length; i++) {
            let thisDateTime = Number(moment(this.timeDistancePoints[i].dateTime).format('X'))
            // adjust min and max where necessary
            if (thisDateTime < min) {
              min = thisDateTime
            }
            if (thisDateTime > max) {
              max = thisDateTime
            }
            if (currentServiceId == this.timeDistancePoints[i].serviceId) {
              // add timing point
              data.push({
                name: this.timeDistancePoints[i].location + ' ' + this.timeDistancePoints[i].type + ' ' + moment.utc(this.timeDistancePoints[i].dateTime).format('HH:mm:ss'),
                value: [thisDateTime, this.timeDistancePoints[i].locationMeterage],
              })
            } else {
              // close series and add timing point to new data
              series.push({
                name: currentServiceId,
                type: 'line',
                data: data,
                lineStyle: {
                  color: '#FFFFFF'
                },
                itemStyle: {
                  color: '#FFFFFF'
                },
              })
              currentServiceId = this.timeDistancePoints[i].serviceId
              data = []
              data.push({
                name: this.timeDistancePoints[i].location + ' ' + this.timeDistancePoints[i].type + ' ' + moment.utc(this.timeDistancePoints[i].dateTime).format('HH:mm:ss'),
                value: [thisDateTime, this.timeDistancePoints[i].locationMeterage],
              })
            }
          }
          this.updateTimeDistanceChart = {
            xAxis: {
              min: min,
              max: max,
            },
            dataZoom: [{
              startValue: min,
              endValue: max,
              maxValueSpan: 86400,
            },
            {
              startValue: min,
              endValue: max,
              maxValueSpan: 86400,
            },],
            series: series
          };
        } else {
          this.dateLineSelected = false
        }
      });
  }
  ngOnInit() {
    // get date & lineId from route params
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      if (params['date'] !== undefined && this.timeDistanceSelect.controls.date.value == null) {
        this.timeDistanceSelect.controls.date.setValue(params['date'])
      }
      if (params['lineId'] !== undefined && this.timeDistanceSelect.controls.lineId.value == null) {
        this.timeDistanceSelect.controls.lineId.setValue(params['lineId'])
      }
      if (this.timeDistanceSelect.value.date !== null && this.timeDistanceSelect.value.lineId !== null) {
        this.updateData();
      }
    })
    this.timeDistanceSelect = new FormGroup({
      date: new FormControl('', [Validators.required]),
      lineId: new FormControl('', [Validators.required]),
    })
    this.timeDistanceChart = {
      title: {
        text: 'Time-Distance Graph',
        left: 'center',
        textStyle: {
          color: '#FFFF',
        },
      },
      // grid: {
      //   height: 680
      // },
      tooltip: {
        show: true,
        trigger: "item",
        formatter: "{a}<br/>{b}"
      },
      dataZoom: [
        {
          type: 'slider',
          show: false,
          realtime: true,
          filterMode: 'weakFilter',
          showDataShadow: false,
          top: 750,
          height: 10,
          xAxisIndex: [0],
          borderColor: 'transparent',
          backgroundColor: '#e2e2e2',
          handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
          handleSize: 20,
          handleStyle: {
            shadowBlur: 6,
            shadowOffsetX: 1,
            shadowOffsetY: 2,
            shadowColor: '#aaa'
          },
          maxValueSpan: 86400,
          // labelFormatter: ''
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          filterMode: 'weakFilter',
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          maxValueSpan: 86400,
        },
      ],
      xAxis: {
        position: 'top',
        type: 'value',
        axisLabel: {
          color: '#ffffff',
          formatter: function (value, index) {
            // Formatted to be human readable
            var date = moment.utc(value * 1000).format("HH:mm");
            return date;
          },
        },
      },
      yAxis: {
        name: 'Meterage',
        nameLocation: 'center',
        nameTextStyle: {
          color: '#ffffff',
        },
        nameGap: 40,
        nameRotate: 90,
        type: 'value',
        axisLabel: {
          color: '#ffffff',
        },
      },
      series: [],
    };

  }
}
