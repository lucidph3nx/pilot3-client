import { Component, OnInit, OnDestroy, ViewEncapsulation, EventEmitter, Output, Injectable } from '@angular/core';
import { egretAnimations } from "app/shared/animations/egret-animations";
import { ServicesService } from '../../../shared/services/data/services.service';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';
import 'core-js/es7/string';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'time-distance',
  templateUrl: './time-distance.page.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./time-distance.page.css'],
  providers: [ServicesService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  animations: egretAnimations,
})
@Injectable()
export class TimeDistanceComponent implements OnInit {

  timeDistanceSelect = new FormGroup({
    date: new FormControl(),
    lineId: new FormControl(),
  })

  constructor(
    private service: ServicesService,
    private route: ActivatedRoute
  ) { }
  private serviceSubscription;
  private routeParamsSubscription;
  lineId = '';
  date = '';
  dateLineSelected = false;
  timeDistancePoints = [];

  timeDistanceChart: any;
  updateTimeDistanceChart: any;



  updateData() {
    this.date = moment(this.timeDistanceSelect.value.date).format('YYYYMMDD')
    this.lineId = this.timeDistanceSelect.value.lineId
    this.getTimeDistancePoints()
  }

  getTimeDistancePoints() {
    this.serviceSubscription = this.service.getTimeDistance(this.date, this.lineId)
      .subscribe((response) => {

        if (response.timeDistance.date !== undefined){
          this.dateLineSelected = true;
          this.timeDistancePoints = response.timeDistance.timeDistancePoints

          let series = []
          let data = []
          let currentServiceId = ''
          for (let i = 0; i < this.timeDistancePoints.length; i++){
            if (currentServiceId == this.timeDistancePoints[i].serviceId){
              // add timing point
              data.push([this.timeDistancePoints[i].dateTime, this.timeDistancePoints[i].locationMeterage])
            } else {
              // close series and add timing point to new data
              series.push({
                name: currentServiceId,
                data: data,
              })
            }
            data = []
            data.push([this.timeDistancePoints[i].dateTime, this.timeDistancePoints[i].locationMeterage])
          }

          this.updateTimeDistanceChart = {
            series: [{
                data: data,
            }]
        };
        } else {
          this.dateLineSelected = false
        }
      });
  }
  ngOnInit() {
    // get date & lineId from route params
    this.routeParamsSubscription=this.route.params.subscribe(params => {
      if (params['date'] !== undefined && this.timeDistanceSelect.controls.date.value == null){
        this.timeDistanceSelect.controls.date.setValue(params['date'])
      }
      if (params['lineId'] !== undefined && this.timeDistanceSelect.controls.serviceId.value == null){
        this.timeDistanceSelect.controls.serviceId.setValue(params['lineId'])
      }
      if (this.timeDistanceSelect.value.date !== null && this.timeDistanceSelect.value.serviceId !== null) {
        this.updateData();
      }
      })
    this.timeDistanceSelect = new FormGroup({
      date: new FormControl('', [Validators.required]),
      lineId: new FormControl('', [Validators.required]),
    })
    this.timeDistanceChart = {
      xAxis: {
          name: 'Time',
          nameLocation: 'center',
          nameTextStyle: {
            color: '#ffffff',
          },
          nameGap: 30,
          type: 'value',
          axisLabel: {
            color: '#ffffff',
          },
      },
      yAxis: {
          name: 'Meterage',
          nameLocation: 'center',
          nameTextStyle: {
            color: '#ffffff',
          },
          nameGap: 40,
          nameRotate: 90,
          type: 'value',
          axisLabel: {
            color: '#ffffff',
          },
      },
      series: [{
          data: [],
          type: 'line'
      }]
  };
  
  }
}
