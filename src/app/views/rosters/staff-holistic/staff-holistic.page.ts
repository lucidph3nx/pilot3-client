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
  holisticYear: string;
  holisticYearData: Array<object>;
  sickToLeaveRatio: number;
  dayCodeMap: any;
  sub;
  holisticCal: any;
  updateHolisticCal: any;
  selectableYears: Array<object>;
  calendarModes: Array<string>;

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

    this.holisticYear = this.holisticCalendarOptions.value.year
    this.calendarModes = ['standard']

    let year = moment('2016-01-01')
    this.selectableYears = []
    do {
      this.selectableYears.push(year.format('YYYY'))
      year = year.add(1, 'year')
    } while (year < moment())

    this.holisticCal = {
      visualMap: {
        categories: [],
        type: 'piecewise',
        dimension: 1,
        orient: 'horizontal',
        left: 'center',
        top: 65,
        textStyle: {
          color: '#FFF'
        },
        inRange: {
          color: [],
          symbolSize: [],
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
    console.log(this.holisticCalendarOptions.value)

    this.holisticYear = this.holisticCalendarOptions.value.year

    
    this.service.getHolisticYear(this.holisticYear, this.staffId)
      .subscribe((response) => {
        this.holisticYearData = response.holisticYearData
        this.holisticYear = response.year
        // this.holisticYearSelect.controls.year
        //this.holisticYearSelect.setValue({year: this.holisticYear})
        this.sickToLeaveRatio = response.sickToLeaveRatio
        this.dayCodeMap = response.dayCodes
        this.updateHolisticCalData()
      });
  }

  updateHolisticCalData() {
    let codeList = []
    for (let i = 0; i < this.dayCodeMap.length; i++) {
      codeList.push(i)
    }
    let colourList = [];
    for (let i = 0; i < this.dayCodeMap.length; i++) {
      colourList.push(this.dayCodeMap[i].colour)
    }
    let localDayCodeMap = this.dayCodeMap;
    // let localHolisticData = this.holisticYearData;
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
        categories: codeList,
        inRange: {
          color: colourList,
          symbolSize: codeList,
        },
        formatter: function (value) {
          return localDayCodeMap[value].dayType;
        },
      },
      calendar: {
        range: this.holisticYear,
      },
      series: {
        data: this.getHolisticYearData(this.holisticYearData),
      },
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
          ]);
        }
      }
    }
    return data;
  }
}