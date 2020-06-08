import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { RosterService } from '../../../shared/services/data/roster.service';
import { StaffService } from '../../../shared/services/data/staff.service';
import { ActivatedRoute } from '@angular/router';
import * as echarts from 'echarts';
import { columnsTotalWidth } from '@swimlane/ngx-datatable/release/utils';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'staff-holistic',
  templateUrl: './staff-holistic.page.html',
  styleUrls: ['./staff-holistic.page.css'],
  providers: [RosterService, StaffService],
})
export class StaffHolistic implements OnInit {

  staffId: string;
  staffSelected = false;
  staffDetails;
  staffPhoto;
  staffPhotoURL: string;
  currentRoster;
  staffVisOptions;
  updateStaffVisOptions;
  selectedDateFrom;
  selectedDateFromString;
  selectedDateTo;
  selectedDateToString;
  staffVisData = []
  dateLabel = []
  public selectedHolisticYear: string;
  holisticYearData: Array<object>;
  holisticYearCounters: Array<object>;
  sickToLeaveRatio: number;
  dayCodeMap: any;
  sub;
  holisticCal: any;
  updateHolisticCal: any;
  selectableYears: Array<string>;
  calendarModes: Array<string>;
  public selectedCalendarMode: any;

  // lookup form
  staffSelect = new FormGroup({
    staffId: new FormControl()
  })
  holisticCalendarOptions = new FormGroup({
    year: new FormControl(),
    calendarMode: new FormControl()
  })
  rosterSelect = new FormGroup({
    dateFrom: new FormControl(),
    dateTo: new FormControl(),
  })
  constructor(
    private rosterService: RosterService,
    private staffservice: StaffService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.initChart()
    this.calendarModes = ['Standard', 'Day Length']

    let year = moment()
    this.selectableYears = []
    do {
      this.selectableYears.push(year.format('YYYY'))
      year = year.subtract(1, 'year')
    } while (year > moment('2016-01-01'))

    this.selectedHolisticYear = this.selectableYears[0]
    this.selectedCalendarMode = this.calendarModes[0]
    // set defaults
    this.holisticCalendarOptions.patchValue({
      year: this.selectedHolisticYear,
      calendarMode: this.selectedCalendarMode,
    })
    this.holisticCal = {
      visualMap: {
        // min: 0,
        // max: 10,
        type: 'piecewise',
        dimension: 1,
        orient: 'horizontal',
        left: 'center',
        top: 10,//65,
        textStyle: {
          color: '#FFF'
        },
      },
      calendar: {
        top: 70,//120,
        //bottom: 100,
        left: 30,
        right: 30,
        cellSize: ['auto', 20],
        range: '2016',
        itemStyle: {
          borderWidth: 0.5,
          color: '#000',
        },
        dayLabel: {
          color: '#FFF',
        },
        monthLabel: {
          color: '#FFF',
        },
        yearLabel: { show: false }
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: [],
      },
    };
    let fortnightBegin
    let fortnightEnd
    if (moment().diff(moment('2016-07-03'), 'weeks') % 2 == 0){
      fortnightBegin = moment().startOf('week');
      fortnightEnd  = moment().endOf('week').add(1, 'week');
    } else {
      fortnightBegin = moment().startOf('week').subtract(1, 'week');
      fortnightEnd  = moment().endOf('week');
    }
    this.rosterSelect.controls['dateFrom'].setValue(fortnightBegin.format())
    this.rosterSelect.controls['dateTo'].setValue(fortnightEnd.format())
  }


  loadData() {
    this.staffId = this.staffSelect.controls.staffId.value
    //this.staffPhotoURL = 'http://'+environment.apiUrl+':4000/api/staffImage?staffId=' + this.staffId.padStart(3, '0')

    this.selectedHolisticYear = this.holisticCalendarOptions.value.year
    this.selectedCalendarMode = this.holisticCalendarOptions.value.calendarMode
    this.rosterService.getHolisticYear(this.selectedHolisticYear, this.staffId)
      .subscribe((response) => {
        this.holisticYearData = response.holisticYearData
        this.holisticYearCounters = response.holisticYearCounters
        this.sickToLeaveRatio = response.sickToLeaveRatio
        this.dayCodeMap = response.dayCodes
        this.updateHolisticCalData()
      });
    this.selectedDateFrom = moment(this.rosterSelect.value.dateFrom);
    this.selectedDateFromString = this.selectedDateFrom.format('YYYY-MM-DD');
    this.selectedDateTo = moment(this.rosterSelect.value.dateTo);
    this.selectedDateFromString = this.selectedDateTo.format('YYYY-MM-DD');

    this.rosterService.getStaffRosterVisualiser(this.selectedDateFrom, this.selectedDateTo, this.staffId)
      .subscribe((response) => {
        this.currentRoster = response.roster.reverse()

        this.renderData(this.currentRoster);
      });
    this.staffservice.getStaffDetail(this.staffId)
      .subscribe((response) => {
        this.staffSelected = true
        this.staffDetails = response.staffDetails
        this.staffPhoto = 'http://' + environment.apiUrl + ':4000/api/staff/' + response.staffDetails.photoURL + "&height=200&width=200"
      });
  }

  counterRowClass(row) {
    console.log('background-color: ' + row.colour)
    return {
      'background-color': row.colour
    };
  }

  updateHolisticCalData() {
    let calendarMode = this.holisticCalendarOptions.value.calendarMode
    let modeDimension;
    let modeMin;
    let modeMax;
    let modeInRange;
    let codeList = []
    let colourList = [];
    let valueFormatFunction;
    switch (calendarMode) {
      case 'Standard':
        modeDimension = 1
        modeMin = 0
        modeMax = 10
        for (let i = 0; i < this.dayCodeMap.length; i++) {
          codeList.push(i)
        }
        for (let i = 0; i < this.dayCodeMap.length; i++) {
          colourList.push(this.dayCodeMap[i].colour)
        }
        modeInRange = {
          color: colourList,
          symbolSize: codeList,
        }
        valueFormatFunction = stdValueFormatterFunction
        break;
      case 'Day Length':
        modeMin = 0
        modeMax = 14
        modeDimension = 8

        codeList = [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        //modeInRange = null
        modeInRange = {
          color: ['#FFF', '#F0CF7E', '#EAC077', '#E4B271', '#DFA46B', '#D99665', '#D4885E', '#CE7A58', '#C96C52', '#C35E4C', '#BE5046'],
          symbolSize: [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        }
        valueFormatFunction = altValueFormatterFunction
        break;
      default:
        modeDimension = 1
        valueFormatFunction = altValueFormatterFunction
    }

    let localDayCodeMap = this.dayCodeMap;
    let getTooltip = function (params) {
      let dayType = localDayCodeMap[params.value[1]].dayType
      let hasShiftDetails = (params.value[4] !== null)
      let tooltip = params.value[0] + " <br/> "
        + dayType + " <br/>"
        + params.value[2] + " <br/> ";
      if (hasShiftDetails) {
        tooltip += params.value[4] + " - " + params.value[3] + " <br/> "
          + params.value[5] + " - " + params.value[6] + " <br/> "
          + params.value[7] + " hours";
      }
      return tooltip;
    }
    this.updateHolisticCal = {
      tooltip: {
        position: 'top',
        formatter: function (params) {
          return getTooltip(params);
        },
      },
      visualMap: {
        dimension: modeDimension,
        categories: codeList,
        min: modeMin,
        max: modeMax,
        inRange: modeInRange,
        formatter: valueFormatFunction
      },
      calendar: {
        range: this.selectedHolisticYear,
      },
      series: {
        data: this.getHolisticYearData(this.holisticYearData),
      },
    }
    if (calendarMode == 'Day Length') {
      //delete this.updateHolisticCal.visualMap.categories
      //delete this.updateHolisticCal.visualMap.inRange
    }
    // console.log(this.holisticCal)
    // console.log(this.updateHolisticCal)
    function stdValueFormatterFunction(value) {
      return localDayCodeMap[value].dayType;
    }
    function altValueFormatterFunction(value) {
      return value;
    }
  }

  getHolisticYearData(holisticYearData) {
    let data = [];
    if (holisticYearData !== []) {
      for (let i = 0; i < holisticYearData.length; i++) {
        if (holisticYearData[i].date !== undefined) {
          data.push([
            moment(holisticYearData[i].date).format('YYYY-MM-DD'),
            this.dayCodeMap.findIndex(item => item.dayType === holisticYearData[i].dayType),
            holisticYearData[i].dayCode,
            holisticYearData[i].location,
            holisticYearData[i].workType,
            holisticYearData[i].hourFrom,
            holisticYearData[i].hourTo,
            holisticYearData[i].totalHours,
            Math.floor(holisticYearData[i].totalHoursNumber),
          ]);
        }
      }
    }
    return data;
  }
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
        maxValueSpan: 14,
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
        zoomOnMouseWheel: false,
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
  renderData(roster) {
    this.staffVisData = []
    this.dateLabel = []
    // hack date serves to pretend all dates are the same for graphing purposes
    let hackDate = moment('1970-01-02')
    let minTime = Number(moment.utc(hackDate.add(1, 'day')).format('x'))
    let maxTime = Number(moment.utc(hackDate.add(-1, 'day')).format('x'))

    for (let i = 0; i < this.currentRoster.length; i++) {
      this.dateLabel.push(this.currentRoster[i].shift + ' - ' + moment(this.currentRoster[i].date).format('DD/MM/YYYY'))
      for (let d = 0; d < this.currentRoster[i].rosterDuties.length; d++) {
        const rosterDuty = this.currentRoster[i].rosterDuties[d];
        let startNextDay = !(moment(this.currentRoster[i].date).isSame(moment(rosterDuty.startTime), 'day'))
        let endNextDay = !(moment(this.currentRoster[i].date).isSame(moment(rosterDuty.endTime), 'day'))
        hackDate = moment('1970-01-02')
        hackDate = hackDate.hour(rosterDuty.dutyStartTimeString.substring(0, 2)).minute(rosterDuty.dutyStartTimeString.substring(3, 5))
        if (startNextDay) {
          hackDate = hackDate.add(1, 'day')
        }
        const startTime = Number(hackDate.format('x'))
        hackDate = moment('1970-01-02')
        hackDate = hackDate.hour(rosterDuty.dutyEndTimeString.substring(0, 2)).minute(rosterDuty.dutyEndTimeString.substring(3, 5))
        if (endNextDay) {
          hackDate = hackDate.add(1, 'day')
        }
        const endTime = Number(hackDate.format('x'))
        const duration = Number(endTime - startTime)
        const fifteenMinutes = 900000 // in miliseconds
        if (endTime > maxTime) {
          maxTime = endTime + fifteenMinutes
        }
        if (startTime < minTime) {
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
    let maxValue = 14
    if (this.currentRoster.length == 1) {
      maxValue = 0
    } else {
      maxValue = 14
    }
    this.updateStaffVisOptions = {
      dataZoom: [
        {
          endValue: maxValue,
          maxValueSpan: maxValue,
        }, {
          endValue: maxValue,
          maxValueSpan: maxValue,
        }, {
          startValue: minTime,
          endValue: maxTime,
        }, {
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
      || api.style().fill == '#ffff00') {
      thisTextColor = '#000000'
    };
    if (api.value(4) == 'MB') {
      thisTextColor = '#FF0000'
    }
    if (api.value(4) == 'SON') {
      // thisTextAlign = 'right'
      // thisTextPosition = 'left'
      thisFontSize = 8
      thisTextValue = 'SON'
    }
    if (api.value(4) == 'SOF') {
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