import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ResourceVisboardDataService } from '../../../shared/services/data/resource-visboard-data.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'resource-visboard',
  templateUrl: './resource-visboard.component.html',
  styleUrls: ['./resource-visboard.component.css'],
  providers: [ResourceVisboardDataService],
})
export class ResourceVisboardComponent implements OnInit {
  staffFilter = new FormGroup({
    staffType: new FormControl()
  })
  constructor(
    private service: ResourceVisboardDataService,
  ) { }

  masterHeadcountdata
  masterAnnualLeaveData
  masterSicknessData
  masterAltDutiesData

  staffTypeList = [
    {value:'ALL'},
    {value:'LE'},
    {value:'TM'},
    {value:'PO'},
    {value:'RCTXO'},
    {value:'PL'},
    {value:'SA'}
  ];
  locationList = [
    {value:'ALL'},
    {value:'MAST'},
    {value:'PK'},
    {value:'UH'},
    {value:'WG'},
  ];
  currentFilters= {
    staffType: 'ALL',
    location: 'ALL',
  }

  filter($event) {
    if ($event.source.placeholder == 'staffType'){
      this.currentFilters.staffType = $event.value
    }
    if ($event.source.placeholder == 'location'){
      this.currentFilters.location = $event.value
    }
    console.log(this.currentFilters)
    this.filterCharts(this.currentFilters)
  }

// ----------Headcount Chart----------
  HeadcountChart = {
    lastYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    thisYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  }
  HeadcountChartColors: Array <any> = [
    {
      //backgroundColor: 'rgba(148,159,177,0.2)',//'#4363d8',
      borderColor: '#4363d8',
      pointBackgroundColor: '#3f51b5',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },{
      //backgroundColor: 'rgba(77,83,96,0.2)',//'#eeeeee',
      borderColor: '#eeeeee',
      pointBackgroundColor: '#3f51b5',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  HeadcountChartLabels: string[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  HeadcountChartType = 'line';
  HeadcountChartLegend = true;
  HeadcountChartData: any[] = [{
   data: this.HeadcountChart.thisYear,
    label: '',
  },{
   data: this.HeadcountChart.lastYear,
    label: '',
  }];
 HeadcountChartOptions: any = Object.assign({
    scaleShowVerticalLines: true,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        },
        ticks: {
         fontColor: "white",
        }
      }],
      yAxes: [{
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        },
        ticks: {
         fontColor: "white",
        }
      }],
    },
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      display: true,
      position: 'top',
      labels: {
       fontColor: "white",
   }
    }
  });
// ----------Annual Leave Chart----------
AnnualLeaveChart = {
  lastYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  thisYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
}
AnnualLeaveChartColors: Array <any> = [
  {
    //backgroundColor: 'rgba(148,159,177,0.2)',//'#4363d8',
    borderColor: '#4363d8',
    pointBackgroundColor: '#3f51b5',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  },{
    //backgroundColor: 'rgba(77,83,96,0.2)',//'#eeeeee',
    borderColor: '#eeeeee',
    pointBackgroundColor: '#3f51b5',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }
];
AnnualLeaveChartLabels: string[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
AnnualLeaveChartType = 'line';
AnnualLeaveChartLegend = true;
AnnualLeaveChartData: any[] = [{
 data: this.AnnualLeaveChart.thisYear,
  label: '',
},{
 data: this.AnnualLeaveChart.lastYear,
  label: '',
}];
AnnualLeaveChartOptions: any = Object.assign({
  scaleShowVerticalLines: true,
  scales: {
    xAxes: [{
      gridLines: {
        color: 'rgba(0,0,0,0.02)',
        zeroLineColor: 'rgba(0,0,0,0.02)'
      },
      ticks: {
       fontColor: "white",
      }
    }],
    yAxes: [{
      gridLines: {
        color: 'rgba(0,0,0,0.02)',
        zeroLineColor: 'rgba(0,0,0,0.02)'
      },
      ticks: {
       fontColor: "white",
      }
    }],
  },
  responsive: true,
  maintainAspectRatio: true,
  legend: {
    display: true,
    position: 'top',
    labels: {
     fontColor: "white",
 }
  }
});
// ----------Sickness Chart----------
SicknessChart = {
  lastYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  thisYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
}
SicknessChartColors: Array <any> = [
  {
    //backgroundColor: 'rgba(148,159,177,0.2)',//'#4363d8',
    borderColor: '#4363d8',
    pointBackgroundColor: '#3f51b5',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  },{
    //backgroundColor: 'rgba(77,83,96,0.2)',//'#eeeeee',
    borderColor: '#eeeeee',
    pointBackgroundColor: '#3f51b5',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }
];
SicknessChartLabels: string[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
SicknessChartType = 'line';
SicknessChartLegend = true;
SicknessChartData: any[] = [{
 data: this.SicknessChart.thisYear,
  label: '',
},{
 data: this.SicknessChart.lastYear,
  label: '',
}];
SicknessChartOptions: any = Object.assign({
  scaleShowVerticalLines: true,
  scales: {
    xAxes: [{
      gridLines: {
        color: 'rgba(0,0,0,0.02)',
        zeroLineColor: 'rgba(0,0,0,0.02)'
      },
      ticks: {
       fontColor: "white",
      }
    }],
    yAxes: [{
      gridLines: {
        color: 'rgba(0,0,0,0.02)',
        zeroLineColor: 'rgba(0,0,0,0.02)'
      },
      ticks: {
       fontColor: "white",
      }
    }],
  },
  responsive: true,
  maintainAspectRatio: true,
  legend: {
    display: true,
    position: 'top',
    labels: {
     fontColor: "white",
 }
  }
});
// ----------AltDuties Chart----------
AltDutiesChart = {
  lastYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  thisYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
}
AltDutiesChartColors: Array <any> = [
  {
    //backgroundColor: 'rgba(148,159,177,0.2)',//'#4363d8',
    borderColor: '#4363d8',
    pointBackgroundColor: '#3f51b5',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  },{
    //backgroundColor: 'rgba(77,83,96,0.2)',//'#eeeeee',
    borderColor: '#eeeeee',
    pointBackgroundColor: '#3f51b5',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }
];
AltDutiesChartLabels: string[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
AltDutiesChartType = 'line';
AltDutiesChartLegend = true;
AltDutiesChartData: any[] = [{
 data: this.AltDutiesChart.thisYear,
  label: '',
},{
 data: this.AltDutiesChart.lastYear,
  label: '',
}];
AltDutiesChartOptions: any = Object.assign({
  scaleShowVerticalLines: true,
  scales: {
    xAxes: [{
      gridLines: {
        color: 'rgba(0,0,0,0.02)',
        zeroLineColor: 'rgba(0,0,0,0.02)'
      },
      ticks: {
       fontColor: "white",
      }
    }],
    yAxes: [{
      gridLines: {
        color: 'rgba(0,0,0,0.02)',
        zeroLineColor: 'rgba(0,0,0,0.02)'
      },
      ticks: {
       fontColor: "white",
      }
    }],
  },
  responsive: true,
  maintainAspectRatio: true,
  legend: {
    display: true,
    position: 'top',
    labels: {
     fontColor: "white",
 }
  }
});

  ngOnInit() {
    this.currentFilters = {
      staffType: 'ALL',
      location: 'ALL',
    }
    this.service.getHeadCountData().subscribe((response) => {
      this.masterHeadcountdata = response
      this.processHeadCountData(this.masterHeadcountdata,this.currentFilters);
    });
    this.service.getAnnualLeaveData().subscribe((response) => {
      this.masterAnnualLeaveData = response
      this.processAnnualLeaveData(this.masterAnnualLeaveData,this.currentFilters);
    });
    this.service.getSicknessData().subscribe((response) => {
      this.masterSicknessData = response
      this.processSicknessData(this.masterSicknessData,this.currentFilters);
    });
    this.service.getAltDutiesData().subscribe((response) => {
      this.masterAltDutiesData = response
      this.processAltDutiesData(this.masterAltDutiesData,this.currentFilters);
    });
    this.staffFilter = new FormGroup({
      staffType: new FormControl()
    })
  }

  filterCharts(currentFilters) {
    this.processHeadCountData(this.masterHeadcountdata,currentFilters)
    this.processAnnualLeaveData(this.masterAnnualLeaveData,currentFilters)
    this.processSicknessData(this.masterSicknessData,currentFilters)
    this.processAltDutiesData(this.masterAltDutiesData,currentFilters)
  }

  processHeadCountData(data,currentFilters){
    this.HeadcountChart = {
      lastYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      thisYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    }
    this.HeadcountChartData = [{
      data: this.HeadcountChart.thisYear,
       label: '',
     },{
      data: this.HeadcountChart.lastYear,
       label: '',
     }];
    let headcountDataRAW = data.headcountData
    let headcountDataFiltered = undefined
    let headcountData = [];
    let thisYear = moment().format('YYYY')
    let lastYear = moment().subtract(1, 'year').format('YYYY')
    this.HeadcountChartData[0].label = thisYear
    this.HeadcountChartData[1].label = lastYear

    if (currentFilters.staffType !== 'ALL'){
      headcountDataFiltered = headcountDataRAW.filter(item => item.position == currentFilters.staffType)
    } 
    if (currentFilters.location !== 'ALL' && headcountDataFiltered == undefined){
      headcountDataFiltered = headcountDataRAW.filter(item => item.location == currentFilters.location)
    } else if (currentFilters.location !== 'ALL' && headcountDataFiltered !== undefined){
      headcountDataFiltered = headcountDataFiltered.filter(item => item.location == currentFilters.location)
    }
    if (headcountDataFiltered == undefined) {
      headcountDataFiltered = headcountDataRAW
    }
    let entryToAdd = {
      year: '',
      fortnight: '',
      begining: {},
      beginingLabel: '',
      count: 0,
    }
    for (let entry = 0; entry < headcountDataFiltered.length; entry++){
      if (headcountDataFiltered[entry].fortnight !== entryToAdd.fortnight) {
        entryToAdd = {
          year: headcountDataFiltered[entry].year,
          fortnight: headcountDataFiltered[entry].fortnight,
          begining: moment(headcountDataFiltered[entry].begining),
          beginingLabel: moment(headcountDataFiltered[entry].begining).format('DD/MM'),
          count: headcountDataFiltered[entry].count,
        }
        headcountData.push(entryToAdd);
      } else {
        entryToAdd.count += headcountDataFiltered[entry].count
      }
    }
    let thisYearData = headcountData.filter(entry => entry.year == thisYear)
    let lastYearData = headcountData.filter(entry => entry.year == lastYear)
    for (let dp = 0; dp < this.HeadcountChart.thisYear.length; dp++){
      if (thisYearData[dp] !== undefined){
        this.HeadcountChart.thisYear[dp] = thisYearData[dp].count
        this.HeadcountChartLabels[dp] = thisYearData[dp].beginingLabel
      } else {
        this.HeadcountChart.thisYear[dp] = undefined
        this.HeadcountChartLabels[dp] = moment((this.HeadcountChartLabels[dp-1]+'/'+thisYear),'DD/MM/YYYY').add(2,'weeks').format('DD/MM')
      }
    }
    for (let dp = 0; dp < this.HeadcountChart.lastYear.length; dp++){
      if (lastYearData[dp] !== undefined){
        this.HeadcountChart.lastYear[dp] = lastYearData[dp].count
      } else {
        this.HeadcountChart.lastYear[dp] = undefined
      }
    }
    let clone1 = JSON.parse(JSON.stringify(this.HeadcountChartData));
    this.HeadcountChartData = clone1;

  }
  processAnnualLeaveData(data,currentFilters){
    this.AnnualLeaveChart = {
      lastYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      thisYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    }
    this.AnnualLeaveChartData = [{
      data: this.AnnualLeaveChart.thisYear,
       label: '',
     },{
      data: this.AnnualLeaveChart.lastYear,
       label: '',
     }];
    let AnnualLeaveDataRAW = data.annualLeaveData
    let AnnualLeaveDataFiltered = undefined
    let AnnualLeaveData = [];
    let thisYear = moment().format('YYYY')
    let lastYear = moment().subtract(1, 'year').format('YYYY')
    this.AnnualLeaveChartData[0].label = thisYear
    this.AnnualLeaveChartData[1].label = lastYear

    if (currentFilters.staffType !== 'ALL'){
      AnnualLeaveDataFiltered = AnnualLeaveDataRAW.filter(item => item.position == currentFilters.staffType)
    } 
    if (currentFilters.location !== 'ALL' && AnnualLeaveDataFiltered == undefined){
      AnnualLeaveDataFiltered = AnnualLeaveDataRAW.filter(item => item.location == currentFilters.location)
    } else if (currentFilters.location !== 'ALL' && AnnualLeaveDataFiltered !== undefined){
      AnnualLeaveDataFiltered = AnnualLeaveDataFiltered.filter(item => item.location == currentFilters.location)
    }
    if (AnnualLeaveDataFiltered == undefined) {
      AnnualLeaveDataFiltered = AnnualLeaveDataRAW
    }
    let entryToAdd = {
      year: '',
      fortnight: '',
      begining: {},
      beginingLabel: '',
      count: 0,
    }
    for (let entry = 0; entry < AnnualLeaveDataFiltered.length; entry++){
      if (AnnualLeaveDataFiltered[entry].fortnight !== entryToAdd.fortnight) {
        entryToAdd = {
          year: AnnualLeaveDataFiltered[entry].year,
          fortnight: AnnualLeaveDataFiltered[entry].fortnight,
          begining: moment(AnnualLeaveDataFiltered[entry].begining),
          beginingLabel: moment(AnnualLeaveDataFiltered[entry].begining).format('DD/MM'),
          count: AnnualLeaveDataFiltered[entry].count,
        }
        AnnualLeaveData.push(entryToAdd);
      } else {
        entryToAdd.count += AnnualLeaveDataFiltered[entry].count
      }
    }
    let thisYearData = AnnualLeaveData.filter(entry => entry.year == thisYear)
    let lastYearData = AnnualLeaveData.filter(entry => entry.year == lastYear)
    for (let dp = 0; dp < this.AnnualLeaveChart.thisYear.length; dp++){
      if (thisYearData[dp] !== undefined){
        this.AnnualLeaveChart.thisYear[dp] = thisYearData[dp].count
        this.AnnualLeaveChartLabels[dp] = thisYearData[dp].beginingLabel
      } else {
        this.AnnualLeaveChart.thisYear[dp] = undefined
        this.AnnualLeaveChartLabels[dp] = moment((this.AnnualLeaveChartLabels[dp-1]+'/'+thisYear),'DD/MM/YYYY').add(2,'weeks').format('DD/MM')
      }
    }
    for (let dp = 0; dp < this.AnnualLeaveChart.lastYear.length; dp++){
      if (lastYearData[dp] !== undefined){
        this.AnnualLeaveChart.lastYear[dp] = lastYearData[dp].count
      } else {
        this.AnnualLeaveChart.lastYear[dp] = undefined
      }
    }
    let clone1 = JSON.parse(JSON.stringify(this.AnnualLeaveChartData));
    this.AnnualLeaveChartData = clone1;

  }
  processSicknessData(data,currentFilters){
    this.SicknessChart = {
      lastYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      thisYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    }
    this.SicknessChartData = [{
      data: this.SicknessChart.thisYear,
       label: '',
     },{
      data: this.SicknessChart.lastYear,
       label: '',
     }];
    let sicknessDataRAW = data.sicknessData
    let sicknessDataFiltered = undefined
    let sicknessData = [];
    let thisYear = moment().format('YYYY')
    let lastYear = moment().subtract(1, 'year').format('YYYY')
    this.SicknessChartData[0].label = thisYear
    this.SicknessChartData[1].label = lastYear

    if (currentFilters.staffType !== 'ALL'){
      sicknessDataFiltered = sicknessDataRAW.filter(item => item.position == currentFilters.staffType)
    } 
    if (currentFilters.location !== 'ALL' && sicknessDataFiltered == undefined){
      sicknessDataFiltered = sicknessDataRAW.filter(item => item.location == currentFilters.location)
    } else if (currentFilters.location !== 'ALL' && sicknessDataFiltered !== undefined){
      sicknessDataFiltered = sicknessDataFiltered.filter(item => item.location == currentFilters.location)
    }
    if (sicknessDataFiltered == undefined) {
      sicknessDataFiltered = sicknessDataRAW
    }
    let entryToAdd = {
      year: '',
      fortnight: '',
      begining: {},
      beginingLabel: '',
      count: 0,
    }
    for (let entry = 0; entry < sicknessDataFiltered.length; entry++){
      if (sicknessDataFiltered[entry].fortnight !== entryToAdd.fortnight) {
        entryToAdd = {
          year: sicknessDataFiltered[entry].year,
          fortnight: sicknessDataFiltered[entry].fortnight,
          begining: moment(sicknessDataFiltered[entry].begining),
          beginingLabel: moment(sicknessDataFiltered[entry].begining).format('DD/MM'),
          count: sicknessDataFiltered[entry].count,
        }
        sicknessData.push(entryToAdd);
      } else {
        entryToAdd.count += sicknessDataFiltered[entry].count
      }
    }
    let thisYearData = sicknessData.filter(entry => entry.year == thisYear)
    let lastYearData = sicknessData.filter(entry => entry.year == lastYear)
    for (let dp = 0; dp < this.SicknessChart.thisYear.length; dp++){
      if (thisYearData[dp] !== undefined){
        this.SicknessChart.thisYear[dp] = thisYearData[dp].count
        this.SicknessChartLabels[dp] = thisYearData[dp].beginingLabel
      } else {
        this.SicknessChart.thisYear[dp] = undefined
        this.SicknessChartLabels[dp] = moment((this.SicknessChartLabels[dp-1]+'/'+thisYear),'DD/MM/YYYY').add(2,'weeks').format('DD/MM')
      }
    }
    for (let dp = 0; dp < this.SicknessChart.lastYear.length; dp++){
      if (lastYearData[dp] !== undefined){
        this.SicknessChart.lastYear[dp] = lastYearData[dp].count
      } else {
        this.SicknessChart.lastYear[dp] = undefined
      }
    }
    let clone1 = JSON.parse(JSON.stringify(this.SicknessChartData));
    this.SicknessChartData = clone1;

  }
  processAltDutiesData(data,currentFilters){
    this.AltDutiesChart = {
      lastYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      thisYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    }
    this.AltDutiesChartData = [{
      data: this.AltDutiesChart.thisYear,
       label: '',
     },{
      data: this.AltDutiesChart.lastYear,
       label: '',
     }];
    let AltDutiesDataRAW = data.altDutiesData
    let AltDutiesDataFiltered = undefined
    let AltDutiesData = [];
    let thisYear = moment().format('YYYY')
    let lastYear = moment().subtract(1, 'year').format('YYYY')
    this.AltDutiesChartData[0].label = thisYear
    this.AltDutiesChartData[1].label = lastYear

    if (currentFilters.staffType !== 'ALL'){
      AltDutiesDataFiltered = AltDutiesDataRAW.filter(item => item.position == currentFilters.staffType)
    } 
    if (currentFilters.location !== 'ALL' && AltDutiesDataFiltered == undefined){
      AltDutiesDataFiltered = AltDutiesDataRAW.filter(item => item.location == currentFilters.location)
    } else if (currentFilters.location !== 'ALL' && AltDutiesDataFiltered !== undefined){
      AltDutiesDataFiltered = AltDutiesDataFiltered.filter(item => item.location == currentFilters.location)
    }
    if (AltDutiesDataFiltered == undefined) {
      AltDutiesDataFiltered = AltDutiesDataRAW
    }
    let entryToAdd = {
      year: '',
      fortnight: '',
      begining: {},
      beginingLabel: '',
      count: 0,
    }
    for (let entry = 0; entry < AltDutiesDataFiltered.length; entry++){
      if (AltDutiesDataFiltered[entry].fortnight !== entryToAdd.fortnight) {
        entryToAdd = {
          year: AltDutiesDataFiltered[entry].year,
          fortnight: AltDutiesDataFiltered[entry].fortnight,
          begining: moment(AltDutiesDataFiltered[entry].begining),
          beginingLabel: moment(AltDutiesDataFiltered[entry].begining).format('DD/MM'),
          count: AltDutiesDataFiltered[entry].count,
        }
        AltDutiesData.push(entryToAdd);
      } else {
        entryToAdd.count += AltDutiesDataFiltered[entry].count
      }
    }
    let thisYearData = AltDutiesData.filter(entry => entry.year == thisYear)
    let lastYearData = AltDutiesData.filter(entry => entry.year == lastYear)
    for (let dp = 0; dp < this.AltDutiesChart.thisYear.length; dp++){
      if (thisYearData[dp] !== undefined){
        this.AltDutiesChart.thisYear[dp] = thisYearData[dp].count
        this.AltDutiesChartLabels[dp] = thisYearData[dp].beginingLabel
      } else {
        this.AltDutiesChart.thisYear[dp] = undefined
        this.AltDutiesChartLabels[dp] = moment((this.AltDutiesChartLabels[dp-1]+'/'+thisYear),'DD/MM/YYYY').add(2,'weeks').format('DD/MM')
      }
    }
    for (let dp = 0; dp < this.AltDutiesChart.lastYear.length; dp++){
      if (lastYearData[dp] !== undefined){
        this.AltDutiesChart.lastYear[dp] = lastYearData[dp].count
      } else {
        this.AltDutiesChart.lastYear[dp] = undefined
      }
    }
    let clone1 = JSON.parse(JSON.stringify(this.AltDutiesChartData));
    this.AltDutiesChartData = clone1;

  }

}
