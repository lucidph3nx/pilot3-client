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
  totalReliabilityFailures = 0
  totalReliabilityServices = 0
  totalReliabilityPercent = 100
  totalPunctualityFailures = 0
  totalPunctualityServices = 0
  totalPunctualityPercent = 100

  ngOnInit() {
    this.service.getCurrentPeakPerformance()
    .subscribe((response) => {
      this.totalServiceCount = 0
      this.totalReliabilityFailures = 0
      this.totalReliabilityServices = 0
      this.totalReliabilityPercent = 100
      this.totalPunctualityFailures = 0
      this.totalPunctualityServices = 0
      this.totalPunctualityPercent = 100
      this.currentPeakPerformance = response
      this.todayDate = moment(this.currentPeakPerformance[0].date).format("DD/MM/YYYY")
      if (this.currentPeakPerformance[0].peak == 1){
        this.currentPeak = 'AM Peak'
      } else {
        this.currentPeak = 'PM Peak'
      }
      for (let lp = 0; lp < this.currentPeakPerformance.length; lp++){
        this.totalServiceCount += this.currentPeakPerformance[lp].totalServices
        this.totalReliabilityFailures += this.currentPeakPerformance[lp].reliabilityFailure
        this.totalPunctualityFailures += this.currentPeakPerformance[lp].punctualityFailure
      }
      this.totalReliabilityServices = this.totalServiceCount - this.totalReliabilityFailures
      this.totalPunctualityServices = this.totalServiceCount - this.totalPunctualityFailures
      this.totalReliabilityPercent = (1 - (this.totalReliabilityFailures / this.totalServiceCount))*100
      this.totalReliabilityPercent = parseFloat(this.totalReliabilityPercent.toFixed(1))
      this.totalPunctualityPercent = (1 - (this.totalPunctualityFailures / this.totalServiceCount))*100
      this.totalPunctualityPercent = parseFloat(this.totalPunctualityPercent.toFixed(1))
      
    });
  }
}
