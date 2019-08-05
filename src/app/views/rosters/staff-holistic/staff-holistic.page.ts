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

  // lookup form
  staffSelect = new FormGroup({
    staffId: new FormControl()
  })
  holisticYearSelect = new FormGroup({
    year: new FormControl()
  })


  constructor(
    private service: RosterService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.holisticCal = {
      visualMap: {
        categories: [],
        type: 'piecewise',
        dimension: 1,
        orient: 'horizontal',
        left: 'center',
        top: 65,
        textStyle: {
          color: '#000'
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
    this.staffPhotoURL = 'http://localhost:4000/api/staffImage?staffId=' + this.staffId.padStart(3, '0')
    this.holisticYear = '2017' //holisticYear
    this.service.getHolisticYear(this.holisticYear, this.staffId)
      .subscribe((response) => {
        this.holisticYearData = response.holisticYearData
        this.holisticYear = response.year
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
    this.updateHolisticCal = {
      tooltip: {
        position: 'top',
        formatter: function (params) {
          let tooltip = params.value[0] + " <br/> "
          + localDayCodeMap[params.value[1]].dayType + " <br/> ";
          return tooltip;
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
          ]);
        }
      }
    }
    return data;
  }
}