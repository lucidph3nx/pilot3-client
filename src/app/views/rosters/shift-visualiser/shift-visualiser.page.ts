import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { RosterService } from '../../../shared/services/data/roster.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import * as echarts from 'echarts';
import { eachDay } from 'date-fns';

@Component({
  selector: 'shift-visualiser',
  templateUrl: './shift-visualiser.page.html',
  styleUrls: ['./shift-visualiser.page.css'],
  providers: [RosterService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class ShiftVisualiser implements OnInit {

  daySelect = new FormGroup({
    date: new FormControl()
  })

  constructor(
    private service: RosterService,
    private route: ActivatedRoute
  ) { }
  roster = []
  selectedDate = moment();
  selectedDateString = this.selectedDate.format('YYYY-MM-DD');

  // variables for graph
  startTime = Number(moment(moment().format('YYYY-MM-DD')).format('x'))
  shiftVisData = []
  shiftNames = []
  updateShiftVisOptions;
  shiftVisOptions = {
    tooltip: {
      formatter: function (params) {
        return params.marker + params.name + " <br/> "
          + params.value[4] + " <br/> "
          + 'From: ' + moment(params.value[1]).format('HH:mm') + " <br/> "
          + 'To: ' + moment(params.value[2]).format('HH:mm') + " <br/> "
          + params.value[3] / 1000 / 60 + " min <br/> "
      }
    },
    title: {
      text: 'Shift Visualiser for ' + this.selectedDateString,
      left: 'center',
      textStyle: {
        color: '#FFFF',
      },
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        yAxisIndex: [0],
        zoomLock: true,
        width: 10,
        handleSize: 0,
        start: 0,
        end: 7,
        showDetail: false,
      },
      {
        type: 'inside',
        yAxisIndex: [0],
        filterMode: 'weakFilter',
        zoomOnMouseWheel: false,
        moveOnMouseMove: true,
        moveOnMouseWheel: true,
      },
      {
        type: 'slider',
        show: true,
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
        labelFormatter: ''
      },
      {
        type: 'inside',
        xAxisIndex: [0],
        filterMode: 'weakFilter',
        zoomOnMouseWheel: false,
        moveOnMouseMove: true,
      },
    ],
    grid: {
      height: 680
    },
    xAxis: {
      min: this.startTime,
      scale: true,
      axisLabel: {
        formatter: function (val) {
          return moment(val).format('HH:mm');
        },
        color: '#FFFF',
      },
      position: 'top',
    },
    yAxis: {
      data: this.shiftNames,
      axisLabel: {
        color: '#FFFF',
      },
    },
    series: [{
      type: 'custom',
      renderItem: this.renderDuty,
      itemStyle: {
        normal: {
          opacity: 0.8
        }
      },
      encode: {
        x: [1, 2],
        y: 0
      },
      data: this.shiftVisData
    }]
  }

  ngOnInit() {
    this.service.getRosterDutiesVisualiser(this.selectedDate)
      .subscribe((response) => {
        this.roster = response.roster
        this.loadData();
      });
  }

  loadData() {
    this.shiftVisData = []
    for (let i = 0; i < this.roster.length; i++) {
      this.shiftNames.push(this.roster[i].shiftId)
      for (let d = 0; d < this.roster[i].rosterDuties.length; d++) {
        const rosterDuty = this.roster[i].rosterDuties[d];
        const startTime = Number(moment(rosterDuty.startTime).format('x'))
        const endTime = Number(moment(rosterDuty.endTime).format('x'))
        const duration = Number(endTime - startTime)
        this.shiftVisData.push({
          name: rosterDuty.name,
          value: [
            i,
            startTime,
            endTime,
            duration,
            rosterDuty.type,
            rosterDuty.name,
          ],
          itemStyle: {
            normal: {
              color: rosterDuty.colourCode,
            }
          }
        });
      }
    }
    this.updateShiftVisOptions = {
      yAxis: {
        data: this.shiftNames
      },
      series: [{
        data: this.shiftVisData,
      }]
    }
  }



  renderDuty(params, api) {
    var categoryIndex = api.value(0);
    var start = api.coord([api.value(1), categoryIndex]);
    var end = api.coord([api.value(2), categoryIndex]);
    var height = api.size([0, 1])[1] * 0.6;

    var rectShape = echarts.graphic.clipRectByRect({
      x: start[0],
      y: start[1] - height / 2,
      width: end[0] - start[0],
      height: height
    }, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
      });

    return rectShape && {
      type: 'rect',
      shape: rectShape,
      style: api.style({
        text: api.value(5),
        // textFill: '#000000',
      })
    };
  }
  // renderGanttItem(params, api) {
  //   // variables for modified graph
  //   var HEIGHT_RATIO = 0.6;
  //   var DIM_CATEGORY_INDEX = 0;
  //   var DIM_TIME_ARRIVAL = 1;
  //   var DIM_TIME_DEPARTURE = 2;
  //   var _cartesianXBounds = [];
  //   var _cartesianYBounds = [];
  //   var categoryIndex = api.value(DIM_CATEGORY_INDEX);
  //   var timeArrival = api.coord([api.value(DIM_TIME_ARRIVAL), categoryIndex]);
  //   var timeDeparture = api.coord([api.value(DIM_TIME_DEPARTURE), categoryIndex]);

  //   var coordSys = params.coordSys;
  //   _cartesianXBounds[0] = coordSys.x;
  //   _cartesianXBounds[1] = coordSys.x + coordSys.width;
  //   _cartesianYBounds[0] = coordSys.y;
  //   _cartesianYBounds[1] = coordSys.y + coordSys.height;

  //   var barLength = timeDeparture[0] - timeArrival[0];
  //   // Get the heigth corresponds to length 1 on y axis.
  //   var barHeight = api.size([0, 1])[1] * HEIGHT_RATIO;
  //   var x = timeArrival[0];
  //   var y = timeArrival[1] - barHeight;

  //   var flightNumber = api.value(3) + '';
  //   var flightNumberWidth = echarts.format.getTextRect(flightNumber).width;
  //   var text = (barLength > flightNumberWidth + 40 && x + barLength >= 180)
  //     ? flightNumber : '';

  //   var rectNormal = clipRectByRect(params, {
  //     x: x, y: y, width: barLength, height: barHeight
  //   });
  //   var rectVIP = clipRectByRect(params, {
  //     x: x, y: y, width: (barLength) / 2, height: barHeight
  //   });
  //   var rectText = clipRectByRect(params, {
  //     x: x, y: y, width: barLength, height: barHeight
  //   });

  //   return {
  //     type: 'group',
  //     children: [{
  //       type: 'rect',
  //       ignore: !rectNormal,
  //       shape: rectNormal,
  //       style: api.style()
  //     }, {
  //       type: 'rect',
  //       ignore: !rectVIP && !api.value(4),
  //       shape: rectVIP,
  //       style: api.style({ fill: '#ddb30b' })
  //     }, {
  //       type: 'rect',
  //       ignore: !rectText,
  //       shape: rectText,
  //       style: api.style({
  //         fill: 'transparent',
  //         stroke: 'transparent',
  //         text: text,
  //         textFill: '#fff'
  //       })
  //     }]
  //   };
  //   function clipRectByRect(params, rect) {
  //     return echarts.graphic.clipRectByRect(rect, {
  //       x: params.coordSys.x,
  //       y: params.coordSys.y,
  //       width: params.coordSys.width,
  //       height: params.coordSys.height
  //     });
  //   }
  // }
}

