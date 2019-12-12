import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { RosterService } from '../../../shared/services/data/roster.service';
import { StaffService } from '../../../shared/services/data/staff.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import * as echarts from 'echarts';
import { eachDay } from 'date-fns';

@Component({
  selector: 'staff-visualiser',
  templateUrl: './staff-visualiser.page.html',
  styleUrls: ['./staff-visualiser.page.css'],
  providers: [RosterService,StaffService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class StaffVisualiser implements OnInit {
  detailSelect = new FormGroup({
    dateFrom: new FormControl(),
    dateTo: new FormControl(),
    staffId: new FormControl()
  })
  constructor(
    private rosterService: RosterService,
    private staffservice: StaffService,
    private route: ActivatedRoute
  ) { }
  selectedDateFrom;
  selectedDateFromString;
  selectedDateTo;
  selectedDateToString;
  staffSelected = false;
  selectedStaffId;
  currentRoster = []
  staffDetails;
  staffPhoto;
  // variables for graph
  startTime;
  endTime;
  staffVisData = []
  dateLabel = []
  updateStaffVisOptions;
  staffVisOptions;
  initChart(){
    this.staffVisOptions = {
    animation: false,
    tooltip: {
      formatter: function (params) {
        return params.marker + params.name + " <br/> "
          + params.value[5] + " <br/> "
          + params.value[4] + " <br/> "
          + 'From: ' + moment(params.value[1]).format('HH:mm') + " <br/> "
          + 'To: ' + moment(params.value[2]).format('HH:mm') + " <br/> "
          + params.value[3] / 1000 / 60 + " min <br/> "
      },
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
        maxValueSpan: 30,
        startValue: 0,
        endValue: 30,
        showDetail: false,
      },
      {
        type: 'inside',
        yAxisIndex: [0],
        filterMode: 'weakFilter',
        zoomOnMouseWheel: false,
        moveOnMouseMove: true,
        moveOnMouseWheel: false,
      },
      {
        type: 'slider',
        show: true,
        filterMode: 'weakFilter',
        showDataShadow: false,
        top: '95%',
        height: 20,
        xAxisIndex: [0],
        labelFormatter: ''
      },
      {
        type: 'inside',
        xAxisIndex: [0],
        filterMode: 'weakFilter',
        zoomOnMouseWheel: true,
        moveOnMouseMove: false,
      },
    ],
    grid: {
      height: '85%',//680,
      right: 35,
      width: '90%'
    },
    xAxis: {
      //min: this.startTime,
      //scale: true,
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
      data: this.dateLabel,
      axisLabel: {
        color: '#FFFF',
        //rotate: 35,
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
      data: this.staffVisData
    }],
    textStyle: {
      color: '#FFF',
      fontWeight: 'bold',
    }
    }
}

  ngOnInit() {
    this.initChart()
  }

  loadData() {
    this.selectedDateFrom = moment(this.detailSelect.value.dateFrom);
    this.selectedDateFromString = this.selectedDateFrom.format('YYYY-MM-DD');
    this.selectedDateTo = moment(this.detailSelect.value.dateTo);
    this.selectedDateFromString = this.selectedDateTo.format('YYYY-MM-DD');
    this.selectedStaffId = this.detailSelect.value.staffId

    this.rosterService.getStaffRosterVisualiser(this.selectedDateFrom, this.selectedDateTo, this.selectedStaffId)
    .subscribe((response) => {
      this.currentRoster = response.roster.reverse()
      this.renderData(this.currentRoster);
    });
    this.staffservice.getStaffDetail(this.selectedStaffId)
    .subscribe((response) => {
      this.staffSelected = true
      this.staffDetails = response.staffDetails
      this.staffPhoto = 'http://' + environment.apiURL + ':4000/api/staff/' + response.staffDetails.photoURL + "&height=200&width=200"
    });
  }

  renderData(roster) {
    this.staffVisData = []
    this.dateLabel = []
    // hack date serves to pretend all dates are the same for graphing purposes
    let hackDate = moment('1970-01-02')
    let minTime = Number(moment.utc(hackDate.add(1, 'day')).format('x'))
    let maxTime = Number(moment.utc(hackDate.add(-1, 'day')).format('x'))

    for (let i = 0; i < this.currentRoster.length; i++) {
      this.dateLabel.push(this.currentRoster[i].shift + ' - '+ moment(this.currentRoster[i].date).format('DD/MM/YYYY'))
      for (let d = 0; d < this.currentRoster[i].rosterDuties.length; d++) {
        const rosterDuty = this.currentRoster[i].rosterDuties[d];
        let startNextDay = !(moment(this.currentRoster[i].date).isSame(moment(rosterDuty.startTime),'day'))
        let endNextDay = !(moment(this.currentRoster[i].date).isSame(moment(rosterDuty.endTime),'day'))
        hackDate = moment('1970-01-02')
        hackDate = hackDate.hour(rosterDuty.dutyStartTimeString.substring(0,2)).minute(rosterDuty.dutyStartTimeString.substring(3,5))
        if (startNextDay){
          hackDate = hackDate.add(1, 'day')
        }
        const startTime = Number(hackDate.format('x'))
        hackDate = moment('1970-01-02')
        hackDate = hackDate.hour(rosterDuty.dutyEndTimeString.substring(0,2)).minute(rosterDuty.dutyEndTimeString.substring(3,5))
        if (endNextDay){
          hackDate = hackDate.add(1, 'day')
        }
        const endTime = Number(hackDate.format('x'))
        const duration = Number(endTime - startTime)
        const fifteenMinutes = 900000 // in miliseconds
        if (endTime > maxTime){
          maxTime = endTime + fifteenMinutes
        }
        if (startTime < minTime){
          minTime = startTime - fifteenMinutes
        }
        // console.log(rosterDuty.dutyName)
        // console.log(rosterDuty.dutyStartTimeString)
        // console.log(startNextDay)
        // console.log(rosterDuty.dutyEndTimeString)
        // console.log(endNextDay)
        // console.log('min='+minTime)
        // console.log('max='+maxTime)
        this.staffVisData.push({
          name: rosterDuty.name,
          value: [
            i,
            startTime,
            endTime,
            duration,
            rosterDuty.dutyType,
            rosterDuty.dutyName,
          ],
          itemStyle: {
            color: rosterDuty.colourCode,
          },
        });
      }
    }
    let maxValue = 30
    if(this.currentRoster.length == 1){
      maxValue = 0
    } else {
      maxValue = 30
    }
    this.updateStaffVisOptions = {
      dataZoom: [
        {
          endValue: maxValue,
          maxValueSpan: maxValue,
        },{
          endValue: maxValue,
          maxValueSpan: maxValue,
        },{
          startValue: minTime,
          endValue: maxTime,
        },{
          startValue: minTime,
          endValue: maxTime,
        },
      ],
      xAxis: {
        min: minTime,
      },
      yAxis: {
        data: this.dateLabel
      },
      series: [{
        data: this.staffVisData,
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
      let thisFontSize = 12
      if (api.style().fill == '#ffffff'
       || api.style().fill == '#ffff00'){
        thisTextColor = '#000000'
      };
      if (api.value(4) == 'MB'){
        thisTextColor = '#FF0000'
      }
      if (api.value(4) == 'SON'){
        // thisTextAlign = 'right'
        // thisTextPosition = 'left'
        thisFontSize = 8
        thisTextValue = 'SON'
      }
      if (api.value(4) == 'SOF'){
        // thisTextAlign = 'left'
        // thisTextPosition = 'right'
        thisFontSize = 8
        thisTextValue = 'SOF'
      }
      // if less than 5 minute duty, do not show any label
      if ((api.value(3) / 1000 / 60) < 14) {
        thisTextValue = ''
      }
    return rectShape && {
      type: 'rect',
      shape: rectShape,
      style: api.style({
        fontSize: thisFontSize,
        text: thisTextValue,
        textFill: thisTextColor,
        textAlign: thisTextAlign,
        textPosition: thisTextPosition,
      })
    };
  }
}

