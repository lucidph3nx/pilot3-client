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
  plannedTimeDistancePoints = [];
  actualTimeDistancePoints = [];
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
          this.plannedTimeDistancePoints = response.timeDistance.plannedTimeDistancePoints
          this.actualTimeDistancePoints = response.timeDistance.actualTimeDistancePoints

          let series = []
          let data = []
          let serviceId;
          let points;
          let min = Number(moment(this.date).add(1, 'days').format('X'));
          let max = Number(moment(this.date).format('X'));
          // add planned points
          for (let i = 0; i < this.plannedTimeDistancePoints.length; i++) {
            serviceId = this.plannedTimeDistancePoints[i].serviceId
            points = this.plannedTimeDistancePoints[i].fixPoints

            let mindateTime = Number(moment(points[0].dateTime).format('X'))
            // adjust min and max where necessary
            if (mindateTime < min) {
              min = mindateTime
            }
            let maxDateTime = Number(moment(points[points.length - 1].dateTime).format('X'))
            if (maxDateTime > max) {
              max = maxDateTime
            }
            // push all planned service lines
            data = []
            for (let p = 0; p < points.length; p++) {
              data.push({
                name: points[p].location + ' ' + moment.utc(points[p].dateTime).format('HH:mm:ss'),
                value: [Number(moment(points[p].dateTime).format('X')), points[p].locationMeterage],
              })
            }
            series.push({
              name: serviceId+'-PLAN',
              type: 'line',
              data: data,
              // label: {
              //   show: true,
              //   position: 'top',
              //   formatter: '{a}',
              //   color: '#97c475',
              // },
              lineStyle: {
                color: '#97c475',
                opacity: 0.2,
              },
              itemStyle: {
                color: '#97c475',
                opacity: 0,
              },
            })
            // push label
            let rotate;
            let position;
            if (points[0].serviceId % 2 == 0) {
              rotate = 80
              position = [-15,0]
            } else {
              rotate = -80
              position = [15,0]
            }
            series.push({
              name: serviceId,
              type: 'line',
              data: [{
                name: points[0].location + ' ' + moment.utc(points[0].dateTime).format('HH:mm:ss'),
                value: [Number(moment(points[0].dateTime).format('X')), points[0].locationMeterage],
              }],
              label: {
                show: true,
                position: position,
                rotate: rotate,
                formatter: '{a}',
                color: '#97c475',
              },
              lineStyle: {
                opacity: 0,
              },
              itemStyle: {
                color: '#97c475',
                opacity: 0.2,
              },
            })
          }
          for (let i = 0; i < this.actualTimeDistancePoints.length; i++) {
            serviceId = this.actualTimeDistancePoints[i].serviceId
            points = this.actualTimeDistancePoints[i].fixPoints

            let mindateTime = Number(moment(points[0].dateTime).format('X'))
            // adjust min and max where necessary
            if (mindateTime < min) {
              min = mindateTime
            }
            let maxDateTime = Number(moment(points[points.length - 1].dateTime).format('X'))
            if (maxDateTime > max) {
              max = maxDateTime
            }
            data = []
            for (let p = 0; p < points.length; p++) {
              data.push({
                name: points[p].location + ' ' + moment.utc(points[p].dateTime).format('HH:mm:ss'),
                value: [Number(moment(points[p].dateTime).format('X')), points[p].locationMeterage],
              })
            }
            series.push({
              name: serviceId,
              type: 'line',
              data: data,
              lineStyle: {
                color: '#be5046',
                opacity: 1,
              },
              itemStyle: {
                color: '#be5046',
                opacity: 0,
              },
            })
          }
          this.updateTimeDistanceChart = {
            xAxis: {
              min: min,
              max: max,
            },
            dataZoom: [{
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
          yAxisIndex: 0,
          filterMode: 'none',
          start: 0,
          end: 100,
          textStyle: {
            color: '#ffffff',
          },
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          filterMode: 'none',
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
