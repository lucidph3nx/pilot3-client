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
  selectedDate = moment();
  selectedDateString = this.selectedDate.format('YYYY-MM-DD');

  // variables for graph
  startTime = Number(moment(this.selectedDate.format('YYYY-MM-DD')).format('x'))
  shiftVisData = []
  shiftNames = []
  updateShiftVisOptions;
  shiftVisOptions = {
    animation: false,
    tooltip: {
      formatter: function (params) {
        return params.marker + params.name + " <br/> "
          + params.value[4] + " <br/> "
          + 'From: ' + moment(params.value[1]).format('HH:mm') + " <br/> "
          + 'To: ' + moment(params.value[2]).format('HH:mm') + " <br/> "
          + params.value[3] / 1000 / 60 + " min <br/> "
      }
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        yAxisIndex: [0],
        zoomLock: true,
        width: 20,
        handleSize: 0,
        rangeMode: 'value',
        maxValueSpan: 20,
        startValue: 0,
        endValue: 20,
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
      interval: 3600000,
      splitLine: {
        lineStyle: {
          color: '#808080',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#FFFF',
        },
      },
    },
    yAxis: {
      data: this.shiftNames,
      axisLabel: {
        color: '#FFFF',
        rotate: 35,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#606060',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#FFFF',
        },
      },
    },
    series: [{
      type: 'custom',
      renderItem: this.renderDuty,
      itemStyle: {
        normal: {
          opacity: 1
        }
      },
      encode: {
        x: [1, 2],
        y: 0
      },
      data: this.shiftVisData
    }],
    textStyle: {
      color: '#FFF',
      fontWeight: 'bold',
    }
  }

  ngOnInit() {
    this.selectedDate = moment();
    this.selectedDateString = this.selectedDate.format('YYYY-MM-DD');
    this.service.getRosterDutiesVisualiser(this.selectedDate)
      .subscribe((response) => {
        this.renderData(response.roster);
      });
  }

  loadData() {
    this.selectedDate = moment(this.daySelect.value.date);
    this.selectedDateString = this.selectedDate.format('YYYY-MM-DD');
    this.service.getRosterDutiesVisualiser(this.selectedDate)
    .subscribe((response) => {
      this.renderData(response.roster);
    });
  }

  renderData(roster) {
    this.shiftVisData = []
    this.shiftNames = []
    let minTime = Number(moment.utc(roster[0].rosterDuties[0].endTime).format('x'))
    let maxTime = Number(moment.utc(roster[0].rosterDuties[0].endTime).format('x'))
    
    for (let i = 0; i < roster.length; i++) {
      this.shiftNames.push(roster[i].staffName+' - '+roster[i].shiftId)
      for (let d = 0; d < roster[i].rosterDuties.length; d++) {
        const rosterDuty = roster[i].rosterDuties[d];
        const startTime = Number(moment(rosterDuty.startTime.substring(0,19)).format('x'))
        const endTime = Number(moment(rosterDuty.endTime.substring(0,19)).format('x'))
        const duration = Number(endTime - startTime)
        if (endTime > maxTime){
          maxTime = endTime
        }
        if (startTime < minTime){
          minTime = startTime
        }
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
            color: rosterDuty.colourCode,
          },
        });
      }
    }
    this.updateShiftVisOptions = {
      dataZoom: [
        {},{},{
          startValue: minTime,
          endValue: maxTime,
        },{
          startValue: minTime,
          endValue: maxTime,
        },
      ],
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
    var height = api.size([0, 1])[1] * 0.8;

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
      let thisTextValue = api.value(5)
      let thisTextColor = api.style().textFill
      let thisTextAlign = 'center'
      let thisTextPosition = 'inside'
      if (api.style().fill == '#ffffff'
       || api.style().fill == '#ffff00'){
        thisTextColor = '#000000'
      };
      if (api.value(4) == 'MB'){
        thisTextColor = '#FF0000'
      }
      if (api.value(4) == 'SON'){
        thisTextAlign = 'right'
        thisTextPosition = 'left'
        thisTextValue = moment(api.value(1)).format('HH:mm')+' Sign-on'
      }
      if (api.value(4) == 'SOF'){
        thisTextAlign = 'left'
        thisTextPosition = 'right'
        thisTextValue = 'Sign-off '+moment(api.value(1)).format('HH:mm')
      }
    return rectShape && {
      type: 'rect',
      shape: rectShape,
      style: api.style({
        text: thisTextValue,
        textFill: thisTextColor,
        textAlign: thisTextAlign,
        textPosition: thisTextPosition,
      })
    };
  }
}

