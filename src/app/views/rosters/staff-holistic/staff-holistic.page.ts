import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { RosterService } from '../../../shared/services/data/roster.service';
import { ActivatedRoute } from '@angular/router';
import * as echarts from 'echarts';

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
    this.dayCodeMap = [
      {code: 'OFF', colour: '#C8C8C8'},
      {code: 'OBR', colour: '#808080'},
      {code: 'SL', colour: '#FF0000'},
      {code: 'AL', colour: '#80FFFF'},
    ];

    let localDayCodeMap = this.dayCodeMap
    this.holisticCal = {
      tooltip: {
          position: 'top',
          formatter: function (params) {
            return params.value[0] + ' - ' + localDayCodeMap[params.value[1]].code;
        },
      },
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
        formatter: function (value) {
          return localDayCodeMap[value].code;
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
        this.holisticYearData = response.holisticYear
        this.updateHolisticCalData()
      });
  }

  updateHolisticCalData() {
    console.log('updatetriggered')
    let codeList = []
    for (let i = 0; i < this.dayCodeMap.length; i++) {
      codeList.push(i)
    }
    let colourList = [];
    for (let i = 0; i < this.dayCodeMap.length; i++) {
      colourList.push(this.dayCodeMap[i].colour)
    }
    
    this.updateHolisticCal = {
      visualMap: {
        categories: codeList,
        inRange: {
          color: colourList,
          symbolSize: codeList,
        },
      },
      calendar: {
        range: this.holisticYear,
      },
      series: {
        data: this.getHolisticYearData(this.holisticYearData),
      },
    }
    console.log(this.updateHolisticCal)
  }

  getHolisticYearData(holisticYearData) {
    let data = [];
    if (holisticYearData !== []) {
      for (let i = 0; i < holisticYearData.length; i++) {
        if (holisticYearData[i].date !== undefined) {
          data.push([
            moment(holisticYearData[i].date).format('YYYY-MM-DD'),
            this.dayCodeMap.findIndex(item => item.code === holisticYearData[i].dayCode),
          ]);
        }
      }
    }
    return data;
  }
}