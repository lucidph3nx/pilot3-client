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
  filterResults = new FormGroup({
    staffType: new FormControl(),
    location: new FormControl()
  })
  searchResults = new FormGroup({
    searchall: new FormControl()
  })

  constructor(
    private service: RosterService,
    private route: ActivatedRoute
  ) { }
  selectedDate = moment();
  selectedDateString = this.selectedDate.format('YYYY-MM-DD');

  staffTypeList = [
    { value: 'ALL' },
    { value: 'LE' },
    { value: 'TM' },
    { value: 'PO' },
    { value: 'RCTXO' },
    { value: 'PL' },
    { value: 'SA' }
  ];
  locationList = [
    { value: 'ALL' },
    { value: 'MAST' },
    { value: 'PK' },
    { value: 'UH' },
    { value: 'WG' },
  ];
  currentFilters = {
    staffType: 'ALL',
    location: 'ALL',
    searchall: '',
  }
  currentRoster = []
  filteredRoster = []
  // variables for graph
  startTime = Number(moment(this.selectedDate.format('YYYY-MM-DD')).format('x'))
  shiftVisData = []
  shiftNames = []
  updateShiftVisOptions;
  shiftVisOptions;
  initChart(){
    this.shiftVisOptions = {
    animation: false,
    tooltip: {
      formatter: function (params) {
        return params.marker + params.name + " <br/> "
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
      width: '85%'
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
      data: this.shiftVisData
    }],
    textStyle: {
      color: '#FFF',
      fontWeight: 'bold',
    }
    }
}
  // applies filters based on userform
  filter($event) {
    if ($event.source.placeholder == 'staffType') {
      this.currentFilters.staffType = $event.value
    }
    if ($event.source.placeholder == 'location') {
      this.currentFilters.location = $event.value
    }
    this.initChart()
    this.renderData(this.currentRoster, this.currentFilters)
  }
  // applies search based on userform
  search($event) {
    if (this.searchResults.value.searchall !== null) {
      this.currentFilters.searchall = this.searchResults.value.searchall
      this.initChart()
      this.renderData(this.currentRoster, this.currentFilters)
    }  
  }
  ngOnInit() {
    this.selectedDate = moment();
    this.selectedDateString = this.selectedDate.format('YYYY-MM-DD');
    this.initChart()
    this.service.getRosterDutiesVisualiser(this.selectedDate)
      .subscribe((response) => {
        this.currentRoster = response.roster
        this.renderData(this.currentRoster, this.currentFilters);
      });
  }

  loadData() {
    this.selectedDate = moment(this.daySelect.value.date);
    this.selectedDateString = this.selectedDate.format('YYYY-MM-DD');
    this.service.getRosterDutiesVisualiser(this.selectedDate)
    .subscribe((response) => {
      this.currentRoster = response.roster
      this.renderData(this.currentRoster, this.currentFilters);
    });
  }

  renderData(roster, filters) {
    this.filteredRoster = roster
    if (filters.staffType !== 'ALL') {
      this.filteredRoster = this.filteredRoster.filter(shift => shift.shiftType === filters.staffType)
    }
    if (filters.location !== 'ALL') {
      this.filteredRoster = this.filteredRoster.filter(shift => shift.shiftLocation === filters.location)
    }
    // search function, goes through all duty labels, staff names and numbers
    if (filters.searchall !== '') {
      let include
      let searchedRoster = [];
      for (let shift = 0; shift < this.filteredRoster.length; shift++) {
        include = false
        if (this.filteredRoster[shift].staffId.includes(filters.searchall)) {
          include = true
        }
        if (this.filteredRoster[shift].shiftId.toUpperCase().includes(filters.searchall.toUpperCase())) {
          include = true
        }
        if (this.filteredRoster[shift].staffName.toUpperCase().includes(filters.searchall.toUpperCase())) {
          include = true
        }
        for (let duty = 0; duty < this.filteredRoster[shift].rosterDuties.length; duty++) {
          if (this.filteredRoster[shift].rosterDuties[duty].name.toUpperCase().includes(filters.searchall.toUpperCase())) {
            include = true
          }
        }
        if (include){
          searchedRoster.push(this.filteredRoster[shift])
        }
      }
      this.filteredRoster = searchedRoster
    }
    this.shiftVisData = []
    this.shiftNames = []
    let minTime = 0
    let maxTime = 1
    if(this.filteredRoster.length !== 0){
      minTime = Number(moment.utc(this.filteredRoster[0].rosterDuties[0].endTime).format('x'))
      maxTime = Number(moment.utc(this.filteredRoster[0].rosterDuties[0].endTime).format('x'))
    }

    for (let i = 0; i < this.filteredRoster.length; i++) {
      this.shiftNames.push(this.filteredRoster[i].staffName+' - '+this.filteredRoster[i].shiftId)
      for (let d = 0; d < this.filteredRoster[i].rosterDuties.length; d++) {
        const rosterDuty = this.filteredRoster[i].rosterDuties[d];
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
    let maxValue
    if(this.filteredRoster.length == 1){
      maxValue = 0
    } else {
      maxValue = 30
    }
    this.updateShiftVisOptions = {
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

