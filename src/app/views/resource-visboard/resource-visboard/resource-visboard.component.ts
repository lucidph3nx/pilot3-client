import { Component, OnInit } from '@angular/core';
import { ResourceVisboardDataService } from '../../../shared/services/data/resource-visboard-data.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'resource-visboard',
  templateUrl: './resource-visboard.component.html',
  styleUrls: ['./resource-visboard.component.css'],
  providers: [ResourceVisboardDataService],
})
export class ResourceVisboardComponent implements OnInit {

  constructor(
    private service: ResourceVisboardDataService,
  ) { }

  HeadcountChart = {
    lastYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    thisYear:    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  }
  LatestHeadcount = {

  }
  HeadcountChartColors: Array <any> = [{
    //backgroundColor: 'rgba(148,159,177,0.2)',//'#4363d8',
    borderColor: '#4363d8',
    pointBackgroundColor: '#3f51b5',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }, {
    //backgroundColor: 'rgba(77,83,96,0.2)',//'#eeeeee',
    borderColor: '#eeeeee',
    pointBackgroundColor: '#3f51b5',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }];
  HeadcountChartLabels: string[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  HeadcountChartType = 'line';
  HeadcountChartLegend = true;
  HeadcountChartData: any[] = [{
   data: this.HeadcountChart.thisYear,
    label: '',
    //borderWidth: 0,
  },{
   data: this.HeadcountChart.lastYear,
    label: '',
    //borderWidth: 0,
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
  ngOnInit() {
    this.service.getHeadCountData().subscribe((response) => {
      this.processHeadCountData(response);
    });
  }
  processHeadCountData(data){
    let headcountDataRAW = data.headcountData
    let headcountData = [];
    let thisYear = moment().format('YYYY')
    let lastYear = moment().subtract(1, 'year').format('YYYY')
    this.HeadcountChartData[0].label = thisYear
    this.HeadcountChartData[1].label = lastYear
    let entryToAdd = {
      year: '',
      fortnight: '',
      begining: {},
      beginingLabel: '',
      count: 0,
    }
    for (let entry = 0; entry < headcountDataRAW.length; entry++){
      if (headcountDataRAW[entry].fortnight !== entryToAdd.fortnight) {
        entryToAdd = {
          year: headcountDataRAW[entry].year,
          fortnight: headcountDataRAW[entry].fortnight,
          begining: moment(headcountDataRAW[entry].begining),
          beginingLabel: moment(headcountDataRAW[entry].begining).format('DD/MM'),
          count: headcountDataRAW[entry].count,
        }
        headcountData.push(entryToAdd);
      } else {
        entryToAdd.count += headcountDataRAW[entry].count
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

}
