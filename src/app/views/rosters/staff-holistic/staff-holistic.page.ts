import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { RosterService } from '../../../shared/services/data/roster.service';
import { ActivatedRoute } from '@angular/router';
import * as echarts from 'echarts';
import { columnsTotalWidth } from '@swimlane/ngx-datatable/release/utils';

@Component({
  selector: 'staff-holistic',
  templateUrl: './staff-holistic.page.html',
  styleUrls: ['./staff-holistic.page.css'],
  providers: [RosterService],
})
export class StaffHolistic implements OnInit {

  staffId: string;
  staffPhotoURL: string;
  public selectedHolisticYear: string;
  holisticYearData: Array<object>;
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


  constructor(
    private service: RosterService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

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
        min: 0,
        max: 10,
        type: 'piecewise',
        dimension: 1,
        orient: 'horizontal',
        left: 'center',
        top: 65,
        textStyle: {
          color: '#FFF'
        },
      },
      calendar: {
        top: 120,
        left: 30,
        right: 30,
        cellSize: ['auto', 20],
        range: '2016',
        itemStyle: {
          normal: { borderWidth: 0.5 }
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
  }


  loadData() {

    this.staffId = this.staffSelect.controls.staffId.value
    //this.staffPhotoURL = 'http://localhost:4000/api/staffImage?staffId=' + this.staffId.padStart(3, '0')

    this.selectedHolisticYear = this.holisticCalendarOptions.value.year
    this.selectedCalendarMode = this.holisticCalendarOptions.value.calendarMode


    this.service.getHolisticYear(this.selectedHolisticYear, this.staffId)
      .subscribe((response) => {
        this.holisticYearData = response.holisticYearData
        //this.holisticYear = response.year
        // this.holisticYearSelect.controls.year
        //this.holisticYearSelect.setValue({year: this.holisticYear})
        this.sickToLeaveRatio = response.sickToLeaveRatio
        this.dayCodeMap = response.dayCodes
        this.updateHolisticCalData()
      });
  }

  updateHolisticCalData() {
    let calendarMode = this.holisticCalendarOptions.value.calendarMode
    let modeDimension;
    let modeMin;
    let modeMax;
    let modeInRange;
    let codeList = []
    let colourList = [];
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
        break;
      case 'Day Length':
        modeDimension = 8
        modeMin = 0
        modeMax = 16
        codeList = [0, 6, 8, 9, 10, 12, 14, 16]
        modeInRange = null
        break;
      default:
        modeDimension = 1
    }

    let localDayCodeMap = this.dayCodeMap;
    let getTooltip = function (params) {
      let dayType = localDayCodeMap[params.value[1]].dayType
      let hasShiftDetails = (params.value[4] !== null)
      let tooltip = params.value[0] + " <br/> "
        + dayType + " <br/>";
      + params.value[2] + " <br/> "
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
        formatter: function (value) {
          switch (calendarMode) {
            case 'Standard':
              return localDayCodeMap[value].dayType;
            case 'Day Length':
              return value;
            default:
              return value;
          }

        },
      },
      calendar: {
        range: this.selectedHolisticYear,
      },
      series: {
        data: this.getHolisticYearData(this.holisticYearData),
      },
    }
    delete this.updateHolisticCal.visualMap.formatter
    console.log(this.updateHolisticCal)
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
            holisticYearData[i].totalHoursNumber,
          ]);
        }
      }
    }
    return data;
  }
}