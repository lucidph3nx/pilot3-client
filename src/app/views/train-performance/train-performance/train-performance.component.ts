import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { CurrentTrainPerformanceService } from '../../../shared/services/data/current-train-performance.service';
import { ActivatedRoute } from '@angular/router';
import { eachDay } from 'date-fns';


@Component({
  selector: 'train-performance',
  templateUrl: './train-performance.component.html',
  styleUrls: ['./train-performance.component.css'],
  providers: [CurrentTrainPerformanceService],
})
export class TrainPerformanceComponent implements OnInit {

  constructor(
    private service: CurrentTrainPerformanceService,
    private route: ActivatedRoute
  ) { }
  currentPeakPerformance = []
  todayDate;
  currentPeak;
  totalServiceCount = 0
  totalReliabilityFailure = 0
  totalReliable = 0
  totalReliabilityPercent = 100
  totalPunctualityFailure = 0
  totalPunctual = 0
  totalPunctualityPercent = 100
  HVL: any;
  JVL: any;
  KPL: any;
  MEL: any;
  WRL: any;

  ngOnInit() {
    this.service.getCurrentPeakPerformance()
    .subscribe((response: any) => {
        // reset these variables to calculate from scratch
      this.totalServiceCount = 0
      this.totalReliabilityFailure = 0
      this.totalReliable = 0
      this.totalReliabilityPercent = 100
      this.totalPunctualityFailure = 0
      this.totalPunctual = 0
      this.totalPunctualityPercent = 100
      // load in response
      this.currentPeakPerformance = response
      this.todayDate = moment(this.currentPeakPerformance[0].date).format("DD/MM/YYYY")
      if (this.currentPeakPerformance[0].peak == 1){
        this.currentPeak = 'AM Peak'
      } else {
        this.currentPeak = 'PM Peak'
      }
      for (let lp = 0; lp < this.currentPeakPerformance.length; lp++){
        this.totalServiceCount += this.currentPeakPerformance[lp].totalServices
        this.totalReliabilityFailure += this.currentPeakPerformance[lp].reliabilityFailure
        this.totalPunctualityFailure += this.currentPeakPerformance[lp].punctualityFailure
        switch(this.currentPeakPerformance[lp].line ) {
          case 'HVL':
            this.HVL = this.currentPeakPerformance[lp]
          case 'JVL':
              this.JVL = this.currentPeakPerformance[lp]
          case 'KPL':
              this.KPL = this.currentPeakPerformance[lp]
          case 'MEL':
              this.MEL = this.currentPeakPerformance[lp]
          case 'WRL':
              this.WRL = this.currentPeakPerformance[lp]
          default:
            //do nothing
        }
      }
      this.totalReliable = this.totalServiceCount - this.totalReliabilityFailure
      this.totalPunctual = this.totalServiceCount - this.totalPunctualityFailure
      if (this.totalReliable !== 0){
        this.totalReliabilityPercent = (this.totalReliable / this.totalServiceCount)*100
        this.totalReliabilityPercent = parseFloat(this.totalReliabilityPercent.toFixed(1))
      } else {
        this.totalReliabilityPercent = 100
      }
      if (this.totalPunctual !== 0){
        this.totalPunctualityPercent = (this.totalPunctual / this.totalServiceCount)*100
        this.totalPunctualityPercent = parseFloat(this.totalPunctualityPercent.toFixed(1))
      } else {
        this.totalReliabilityPercent = 100
      }
    });
  }
}

