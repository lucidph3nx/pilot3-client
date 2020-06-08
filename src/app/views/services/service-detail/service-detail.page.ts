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
import { columnsTotalWidth } from '@swimlane/ngx-datatable/release/utils';
import * as echarts from 'echarts';
import { ThemingFormFieldComponent } from 'assets/examples/material/theming-form-field/theming-form-field.component';

@Component({
  selector: 'service-detail',
  templateUrl: './service-detail.page.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./service-detail.page.css'],
  providers: [ServicesService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  animations: egretAnimations,
})
@Injectable()
export class ServiceDetailComponent implements OnInit {

  serviceSelect = new FormGroup({
    date: new FormControl(),
    serviceId: new FormControl(),
  })

  constructor(
    private service: ServicesService,
    private route: ActivatedRoute
  ) { }
  private serviceSubscription;
  private routeParamsSubscription;
  serviceId = '';
  date = '';
  serviceSelected = false;
  serviceDetail = {};
  serviceHeading = '';
  timingPoints = [];
  crew = [];
  TSRList = [];
  consist = [];
  reliabilityFailure = false;
  punctualityFailure = false;
  delayOverall = 0
  delayBreakdownSeconds = {
    origin: 25,
    TSR: 25,
    betweenStations: 25,
    atStations: 25,
  }
  delayBreakdownFriendly = {
    origin: '',
    TSR: '',
    betweenStations: '',
    atStations: '',
  }
  delayBreakdownPercent = {
    origin: 25,
    TSR: 25,
    betweenStations: 25,
    atStations: 25,
  }
  chartColours = {
    AtOrigin: '#be5046',
    TSR: '#97c475',
    BetweenStations: '#ef802f',
    AtStations: '#f0cf7e',
  }


  delayBreakdownChart: any;
  updateDelayBreakdownChart: any;

  distanceDelayChart: any;
  updateDistanceDelayChart: any;

  getFailureClass({ row, column, value }): any {
    return {
      'variance-early': row.earlyDepart === true,
      'variance-verylate': row.punctualityFailure === true,
    };
  }

  updateData() {
    this.date = moment(this.serviceSelect.value.date).format('YYYYMMDD')
    this.serviceId = this.serviceSelect.value.serviceId
    this.getServiceDetail()
  }

  getServiceDetail() {
    this.serviceSubscription = this.service.getServiceDetail(this.date, this.serviceId)
      .subscribe((response) => {
        this.serviceDetail = response.serviceDetail
        if (response.serviceDetail.serviceId !== undefined) {
          this.serviceSelected = true;
          let serviceId = response.serviceDetail.serviceId;
          let dateString = moment(response.serviceDetail.date).format('DD/MM/YYYY');
          this.serviceHeading = serviceId + ' on ' + dateString;
          this.crew = response.serviceDetail.crew
          for (let i = 0; i < this.crew.length; i++) {
            this.crew[i].photoURL = 'http://' + environment.apiUrl + ':4000/api/staff/' + this.crew[i].photoURL + "&height=200&width=200"
          }
          this.consist = response.serviceDetail.consist
          this.reliabilityFailure = response.serviceDetail.reliabilityFailure
          this.punctualityFailure = response.serviceDetail.punctualityFailure
          this.timingPoints = response.serviceDetail.timingPoints;
          this.TSRList = response.serviceDetail.TSRList
          console.log(this.TSRList)
          if (this.punctualityFailure) {
            this.delayOverall = response.serviceDetail.delayOverall;
            this.delayBreakdownSeconds.origin = response.serviceDetail.delayBreakdown.origin
            this.delayBreakdownFriendly.origin = this.formatMomentMinSec(moment().startOf('day').seconds(response.serviceDetail.delayBreakdown.origin));
            this.delayBreakdownPercent.origin = Math.round((response.serviceDetail.delayBreakdown.origin / response.serviceDetail.delayOverall) * 100)
            this.delayBreakdownSeconds.TSR = response.serviceDetail.delayBreakdown.TSR
            this.delayBreakdownFriendly.TSR = this.formatMomentMinSec(moment().startOf('day').seconds(response.serviceDetail.delayBreakdown.TSR));
            this.delayBreakdownPercent.TSR = Math.round((response.serviceDetail.delayBreakdown.TSR / response.serviceDetail.delayOverall) * 100)
            this.delayBreakdownSeconds.betweenStations = response.serviceDetail.delayBreakdown.betweenStations
            this.delayBreakdownFriendly.betweenStations = this.formatMomentMinSec(moment().startOf('day').seconds(response.serviceDetail.delayBreakdown.betweenStations));
            this.delayBreakdownPercent.betweenStations = Math.round((response.serviceDetail.delayBreakdown.betweenStations / response.serviceDetail.delayOverall) * 100)
            this.delayBreakdownSeconds.atStations = response.serviceDetail.delayBreakdown.atStations
            this.delayBreakdownFriendly.atStations = this.formatMomentMinSec(moment().startOf('day').seconds(response.serviceDetail.delayBreakdown.atStations));
            this.delayBreakdownPercent.atStations = Math.round((response.serviceDetail.delayBreakdown.atStations / response.serviceDetail.delayOverall) * 100)
          }

          this.updateDelayBreakdownChart = {
            series: [
              {
                data: [
                  { name: 'At Origin', value: response.serviceDetail.delayBreakdown.origin },
                  { name: 'TSRs', value: response.serviceDetail.delayBreakdown.TSR },
                  { name: 'Between Stations', value: response.serviceDetail.delayBreakdown.betweenStations },
                  { name: 'At Stations', value: response.serviceDetail.delayBreakdown.atStations },
                ]
              },
            ],
          }
          let series = []
          let dataPrimary = []
          let chartColours = this.chartColours
          for (let i = 0; i < this.timingPoints.length; i++) {
            let secondsLate
            let lateEarly = '';
            if (this.timingPoints[i].secondsLate < 0) {
              secondsLate = '-' + this.formatMomentMinSec(moment().startOf('day').add(Math.abs(this.timingPoints[i].secondsLate), 'seconds'))
              lateEarly = ' EARLY'
            } else if (this.timingPoints[i].secondsLate >= 0) {
              secondsLate = this.formatMomentMinSec(moment().startOf('day').add(Math.abs(this.timingPoints[i].secondsLate), 'seconds'))
              lateEarly = ' LATE'
            }
            dataPrimary.push({
              name: this.timingPoints[i].location + ' ' + this.timingPoints[i].activityType + ' ' + secondsLate + lateEarly,
              value: [this.timingPoints[i].locationMeterage, this.timingPoints[i].secondsLate],
            })
          }
          //reset chart
          this.initialiseCharts()
          //push the primary series
          series.push({
            data: dataPrimary,
            type: 'line',
          })
          //push the aditional series that highlight impact of delay
          if (this.punctualityFailure) {
            for (let i = 0; i < this.timingPoints.length; i++) {
              if (this.timingPoints[i].impactSeconds !== 0){
                if (this.timingPoints[i].activityType == 'Origin') {
                  series.push(this.drawDelayShape(i, this.timingPoints, chartColours.AtOrigin))
                }
                if (this.timingPoints[i].activityType == 'Departs') {
                  series.push(this.drawDelayShape(i, this.timingPoints, chartColours.AtStations))
                }
                if (this.timingPoints[i].activityType == 'Arrives' || this.timingPoints[i].activityType == 'Terminates') {
                    series.push(this.drawDelayShape(i, this.timingPoints, chartColours.BetweenStations))
                    // if (this.timingPoints[i].TSRDelaySec > 0) {
                    //   for (let sr = 0; sr < this.TSRList.length; sr++){
                    //     let thisTSR = this.TSRList[sr]
                    //     let startsInRange 
                    //     let endsInRange
                    //     // if (this.timingPoints[i].direction == 'D') {
                    //     //   startsInRange = (thisTSR.distanceFrom < this.timingPoints[i].locationMeterage
                    //     //     && !(thisTSR.distanceFrom < this.timingPoints[i-1].locationMeterage))
                    //     //   endsInRange = (thisTSR.distanceTo < this.timingPoints[i].locationMeterage
                    //     //     && !(thisTSR.distanceTo < this.timingPoints[i-1].locationMeterage))
                    //     // } else {
                    //       startsInRange = (thisTSR.distanceFrom > this.timingPoints[i-1].locationMeterage
                    //         && !(thisTSR.distanceFrom > this.timingPoints[i].locationMeterage))
                    //       endsInRange = (thisTSR.distanceTo > this.timingPoints[i-1].locationMeterage
                    //         && !(thisTSR.distanceTo > this.timingPoints[i].locationMeterage))
                    //     // }
                    //     console.log(this.timingPoints[i].location + ' ' + this.timingPoints[i-1].locationMeterage +'-'+ this.timingPoints[i].locationMeterage)
                    //     console.log(thisTSR)
                    //     console.log(startsInRange)
                    //     console.log(endsInRange)
                    //     if (startsInRange || endsInRange) {
                    //       // series.push(this.drawDelayShape(i, this.timingPoints, chartColours.TSR))
                    //       // console.log(this.timingPoints[i].location + ' ' + this.timingPoints[i-1].locationMeterage +'-'+ this.timingPoints[i].locationMeterage)
                    //       // console.log(thisTSR)
                    //       // console.log(startsInRange)
                    //       // console.log(endsInRange)
                    //       series.push(this.drawTSRShape(i, this.timingPoints, thisTSR, chartColours.TSR))
                    //     }
                    //   }
                    // }
                }
              }
            }
          }
          // determine if traveling away from or towards zero meters
          let inverse = false
          if (response.serviceDetail.direction == 'D') {
            inverse = true
          }
          this.updateDistanceDelayChart = {
            xAxis: {
              min: this.timingPoints[0].locationMeterage,
              max: this.timingPoints[this.timingPoints.length - 1].locationMeterage,
              inverse: inverse,
            },
            series: series
          };
        } else {
          this.serviceSelected = false
        }
      });
  }

  ngOnInit() {
    // get date & serviceId from route params
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      if (params['date'] !== undefined && this.serviceSelect.controls.date.value == null) {
        this.serviceSelect.controls.date.setValue(params['date'])
      }
      if (params['serviceId'] !== undefined && this.serviceSelect.controls.serviceId.value == null) {
        this.serviceSelect.controls.serviceId.setValue(params['serviceId'])
      }
      if (this.serviceSelect.value.date !== null && this.serviceSelect.value.serviceId !== null) {
        this.updateData();
      }
    })
    this.serviceSelect = new FormGroup({
      date: new FormControl('', [Validators.required]),
      serviceId: new FormControl('', [Validators.required]),
    })
    this.initialiseCharts()
  }
  initialiseCharts(){
    this.delayBreakdownChart = {
      color: [
        this.chartColours.AtOrigin,
        this.chartColours.TSR,
        this.chartColours.BetweenStations,
        this.chartColours.AtStations,
      ],
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {d}% ({c} seconds)"
      },
      series: [
        {
          name: "Delay Breakdown",
          type: "pie",
          radius: "55%",
          center: ["50%", "50%"],
          data: [
            { name: 'At Origin', value: 1 },
            { name: 'TSRs', value: 1 },
            { name: 'Between Stations', value: 1 },
            { name: 'At Stations', value: 1 },
          ],
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
    this.distanceDelayChart = {
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
        name: 'Meterage',
        nameLocation: 'center',
        nameTextStyle: {
          color: '#ffffff',
        },
        nameGap: 30,
        type: 'value',
        axisLabel: {
          color: '#ffffff',
        },
      },
      yAxis: {
        name: 'Schedule Variance',
        nameLocation: 'center',
        nameTextStyle: {
          color: '#ffffff',
        },
        nameGap: 50,
        nameRotate: 90,
        type: 'value',
        axisLabel: {
          color: '#ffffff',
          formatter: function (value, index) {
            // Formatted to be human readable
            let tempMoment = moment().startOf('day').add(Math.abs(value), 'seconds')
            let formattedString;
            let hours = tempMoment.hour()
            let minutes = tempMoment.minute() + (hours * 60)
            let seconds = tempMoment.second()
            formattedString = (minutes.toString()).padStart(2, '0') + ':'
              + (seconds.toString()).padStart(2, '0')
            if (value < 0) {
              formattedString = '-' + formattedString
            }
            return formattedString;
          },
        },
      },
      series: [{
        data: [],
        type: 'line',
      }]
    };
  }

  formatMomentMinSec(moment) {
    let formattedString;
    let hours = moment.hour()
    let minutes = moment.minute() + (hours * 60)
    let seconds = moment.second()
    formattedString = (minutes.toString()).padStart(2, '0') + ':'
      + (seconds.toString()).padStart(2, '0')
    return formattedString;
  }

  drawDelayShape(impactedIndex, timingPoints, colour) {

    let data = definePoints(impactedIndex, timingPoints)
    return {
      data: data,
      type: 'custom',
      renderItem: function (params, api) {
        if (params.context.rendered) {
          return;
        }
        params.context.rendered = true;
        var points = [];
        for (var i = 0; i < data.length; i++) {
          points.push(api.coord(data[i]));
        }
        return {
          type: 'polygon',
          shape: {
            points: echarts.graphic.clipPointsByRect(points, {
              x: params.coordSys.x,
              y: params.coordSys.y,
              width: params.coordSys.width,
              height: params.coordSys.height
            })
          },
          style: api.style({
            fill: colour,
            opacity: 0.4,
          })
        };
      },
    }
    function definePoints(impactedIndex, timingPoints) {
      //determine the location of greatest punctuality failure
      let failurePoint = undefined
      for (let i = 0; i < timingPoints.length; i++) {
        if (timingPoints[i].punctualityFailure) {
          if (failurePoint == undefined || timingPoints[i].secondsLate > failurePoint.secondsLate)
            failurePoint = timingPoints[i]
        }
      }
      if (impactedIndex == 0) {
        //console.log(timingPoints[impactedIndex].secondsLate - timingPoints[impactedIndex].impactSeconds)
        return [
          [timingPoints[impactedIndex].locationMeterage, 0],
          [timingPoints[impactedIndex].locationMeterage, timingPoints[impactedIndex].impactSeconds],
          [failurePoint.locationMeterage, timingPoints[impactedIndex].impactSeconds],
          [failurePoint.locationMeterage, 0],
        ]
      }
      let lowY = timingPoints[impactedIndex - 1].secondsLate
      let lowX = timingPoints[impactedIndex - 1].locationMeterage
      let slope = (timingPoints[impactedIndex].secondsLate - timingPoints[impactedIndex - 1].secondsLate)
        / (timingPoints[impactedIndex].locationMeterage - timingPoints[impactedIndex - 1].locationMeterage)
      let yIntercept = timingPoints[impactedIndex].secondsLate - (slope * timingPoints[impactedIndex].locationMeterage)
      if (lowY < 0) {
        lowY = 0
        lowX = (lowY - yIntercept) / slope;
      }
      let highY = lowY + timingPoints[impactedIndex].impactSeconds
      let highX
      if (timingPoints[impactedIndex - 1].locationMeterage == timingPoints[impactedIndex].locationMeterage) {
        highX = lowX
      } else {
        highX = (highY - yIntercept) / slope;
      }

      return [
        [lowX, lowY], // X
        [highX, highY], // Y
        [failurePoint.locationMeterage, highY],
        [failurePoint.locationMeterage, lowY],
      ];
    }
  }
  drawTSRShape(impactedIndex, timingPoints, thisTSR, colour) {
    let data = definePoints(impactedIndex, timingPoints, thisTSR)
    return {
      data: data,
      type: 'custom',
      renderItem: function (params, api) {
        if (params.context.rendered) {
          return;
        }
        params.context.rendered = true;
        var points = [];
        for (var i = 0; i < data.length; i++) {
          points.push(api.coord(data[i]));
        }
        return {
          type: 'polygon',
          shape: {
            points: echarts.graphic.clipPointsByRect(points, {
              x: params.coordSys.x,
              y: params.coordSys.y,
              width: params.coordSys.width,
              height: params.coordSys.height
            })
          },
          style: api.style({
            fill: colour,
            opacity: 0.4,
          })
        };
      },
    }
    function definePoints(impactedIndex, timingPoints, thisTSR) {
      //determine the location of greatest punctuality failure
      let failurePoint = undefined
      for (let i = 0; i < timingPoints.length; i++) {
        if (timingPoints[i].punctualityFailure) {
          if (failurePoint == undefined || timingPoints[i].secondsLate > failurePoint.secondsLate)
            failurePoint = timingPoints[i]
        }
      }
      // here should be the TSR point definiton code
      let slope = (timingPoints[impactedIndex].secondsLate - timingPoints[impactedIndex - 1].secondsLate)
          / (timingPoints[impactedIndex].locationMeterage - timingPoints[impactedIndex - 1].locationMeterage)
      let yIntercept = timingPoints[impactedIndex].secondsLate - (slope * timingPoints[impactedIndex].locationMeterage)

      let lowX = thisTSR.distanceFrom
      let lowY = (slope * lowX) + yIntercept

      let highY = lowY + timingPoints[impactedIndex].TSRDelaySec
      let highX = (highY - yIntercept) / slope;

      // let highX = thisTSR.distanceTo
      // let highY = (slope * highX) + yIntercept

      // return [
      //   [thisTSR.distanceFrom, 0],
      //   [thisTSR.distanceTo, 0],
      //   [thisTSR.distanceTo, lowY],
      //   [thisTSR.distanceFrom, highY],
      // ];
      return [
        [lowX, lowY], // X
        [highX, highY], // Y
        [failurePoint.locationMeterage, highY],
        [failurePoint.locationMeterage, lowY],
      ];
    }
  }
}
