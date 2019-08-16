import { Component, OnInit, OnDestroy, ViewEncapsulation, EventEmitter, Output, Injectable } from '@angular/core';
import { egretAnimations } from "app/shared/animations/egret-animations";
import { ServicesService } from '../../../shared/services/data/services.service';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment-timezone';
import 'core-js/es7/string';

@Component({
  selector: 'service-detail',
  templateUrl: './service-detail.page.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./service-detail.page.css'],
  providers: [ServicesService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  animations: egretAnimations,
})
@Injectable()
export class ServiceDetailComponent implements OnInit {

  serviceSelect = new FormGroup({
    date: new FormControl(),
    serviceId: new FormControl(),
  })

  constructor(
    private service: ServicesService,
  ) { }
  private serviceSubscription;
  serviceId = '';
  date = '';
  serviceDetail = {};
  serviceHeading = '';
  timingPoints = [];
  delayOverall = 0
  delayBreakdown = {
    origin: 25,
    TSR: 25,
    betweenStations: 25,
    atStations: 25,
  }
  delayBreakdownPercent = {
    origin: 25,
    TSR: 25,
    betweenStations: 25,
    atStations: 25,
  }
  delayBreakdownChart: any;
  updateDelayBreakdownChart: any;

  getFailureClass({ row, column, value }): any {
    return {
      'variance-early': row.earlyDepart === true,
      'variance-verylate': row.punctualityFailure === true,
    };
  }

  updateData() {
    this.date = moment(this.serviceSelect.value.date).format('YYYYMMDD')
    this.serviceId = this.serviceSelect.value.serviceId
    this.getServiceDetail()
  }

  getServiceDetail() {
    this.serviceSubscription = this.service.getServiceDetail(this.date, this.serviceId)
      .subscribe((response) => {
        this.serviceDetail = response.serviceDetail
        let serviceId = response.serviceDetail.serviceId;
        let dateString = moment(response.serviceDetail.date).format('DD/MM/YYYY');
        this.serviceHeading = serviceId + ' on ' + dateString;
        this.timingPoints = response.serviceDetail.timingPoints;
        this.delayOverall = response.serviceDetail.delayOverall;
        this.delayBreakdown.origin = response.serviceDetail.delayBreakdown.origin
        this.delayBreakdownPercent.origin = Math.round((response.serviceDetail.delayBreakdown.origin / response.serviceDetail.delayOverall)*100)
        this.delayBreakdown.TSR = response.serviceDetail.delayBreakdown.TSR
        this.delayBreakdownPercent.TSR = Math.round((response.serviceDetail.delayBreakdown.TSR / response.serviceDetail.delayOverall)*100)
        this.delayBreakdown.betweenStations = response.serviceDetail.delayBreakdown.betweenStations
        this.delayBreakdownPercent.betweenStations = Math.round((response.serviceDetail.delayBreakdown.betweenStations / response.serviceDetail.delayOverall)*100)
        this.delayBreakdown.atStations = response.serviceDetail.delayBreakdown.atStations
        this.delayBreakdownPercent.atStations = Math.round((response.serviceDetail.delayBreakdown.atStations / response.serviceDetail.delayOverall)*100)
        this.updateDelayBreakdownChart = {
          series: [
            {
              data: [
                { name: 'At Origin', value: response.serviceDetail.delayBreakdown.origin },
                { name: 'TSRs', value: response.serviceDetail.delayBreakdown.TSR },
                { name: 'Between Stations', value: response.serviceDetail.delayBreakdown.betweenStations },
                { name: 'At Stations', value: response.serviceDetail.delayBreakdown.atStations },
              ]
            },
          ],
        }
        //this.updateData()
        console.log(this.serviceDetail)
      });
  }
  ngOnInit() {
    this.serviceSelect = new FormGroup({
      date: new FormControl('', [Validators.required]),
      serviceId: new FormControl('', [Validators.required]),
    })
    this.delayBreakdownChart = {
      color: [
        '#be5046',
        '#97c475',
        '#ef802f',
        '#f0cf7e',
      ],
      // legend: {
      //   textStyle: {
      //     color: 'rgba(256,256,256,1)'
      //   },
      //   x: 'right',
      //   orient: 'vertical',
      //   position: 'right',
      //   data: ['At Origin', 'TSRs', 'Between Stations', 'At Stations']
      // },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {d}% ({c} seconds)"
      },
      series: [
        {
          name: "Delay Breakdown",
          type: "pie",
          radius: "55%",
          center: ["50%", "50%"],
          data: [
            { name: 'At Origin', value: 1 },
            { name: 'TSRs', value: 1 },
            { name: 'Between Stations', value: 1 },
            { name: 'At Stations', value: 1 },
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
  }
}
