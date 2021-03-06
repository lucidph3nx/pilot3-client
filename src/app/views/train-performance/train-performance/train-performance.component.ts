import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment-timezone';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { TrainPerformanceService } from '../../../shared/services/data/train-performance.service';
import { ActivatedRoute } from '@angular/router';
import { eachDay } from 'date-fns';


@Component({
  selector: 'train-performance',
  templateUrl: './train-performance.component.html',
  styleUrls: ['./train-performance.component.css'],
  providers: [TrainPerformanceService],
})
export class TrainPerformanceComponent implements OnInit {

  reportSelect = new FormGroup({
    reportOptions: new FormControl('Today')
  })

  constructor(
    private service: TrainPerformanceService,
    private route: ActivatedRoute
  ) { }
  private trainPerformanceSubscription;

  reportOptionList = [
    { value: 'Today' },
    { value: 'Yesterday' },
    { value: 'Week To Date' },
    { value: 'Month To Date' },
  ]

  trainPerformance = []
  reportLabel;
  currentPeak;
  totalServiceCount = 0
  totalReliabilityFailure = 0
  totalReliable = 0
  totalReliabilityPercent = 100
  totalPunctualityFailure = 0
  totalPunctual = 0
  totalPunctualityPercent = 100
  
  blankLinePerformance = {
    date: "",
    line: "",
    peak: "",
    reliabilityFailure: 0,
    punctualityFailure: 0,
    totalServices: 0,
    percentPunctualityFailure: 0,
    percentReliabilityFailure: 0,
  }
  HVL = this.blankLinePerformance;
  JVL = this.blankLinePerformance;
  KPL = this.blankLinePerformance;
  MEL = this.blankLinePerformance;
  WRL = this.blankLinePerformance;

  selectReport(event){
    this.subscribeReport()
  }

  ngOnInit() {
    this.subscribeReport()
  }
  subscribeReport(){
    let dateFrom
    let dateTo
    switch (this.reportSelect.value.reportOptions) {
      case 'Today':
        dateFrom = moment()
        dateTo = moment()
        this.reportLabel = moment().format("DD/MM/YYYY")
        break;
        case 'Yesterday':
          dateFrom = moment().subtract(1, "days")
          dateTo = moment().subtract(1, "days")
          this.reportLabel = moment().subtract(1, "days").format("DD/MM/YYYY")
          break;
      case 'Week To Date':
        dateFrom = moment().startOf('week')
        dateTo = moment()
        this.reportLabel = 'week until '+moment().format("DD/MM/YYYY")
        break;
      case 'Month To Date':
        dateFrom = moment().startOf('month')
        dateTo = moment()
        this.reportLabel = 'month until '+moment().format("DD/MM/YYYY")
        break;
      default:
        dateFrom = moment()
        dateTo = moment()
        this.reportLabel = moment().format("DD/MM/YYYY")
        break;
    }
    if (this.trainPerformanceSubscription){
      this.trainPerformanceSubscription.unsubscribe();
    }
    this.trainPerformanceSubscription = this.service.getTrainPerformance(dateFrom, dateTo)
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
      this.trainPerformance = response.trainPerformance
      
      for (let lp = 0; lp < this.trainPerformance.length; lp++){
        this.totalServiceCount += this.trainPerformance[lp].totalServices
        this.totalReliabilityFailure += this.trainPerformance[lp].reliabilityFailure
        this.totalPunctualityFailure += this.trainPerformance[lp].punctualityFailure
        switch(this.trainPerformance[lp].line ) {
          case 'HVL':
            this.HVL = this.trainPerformance[lp]
          case 'JVL':
              this.JVL = this.trainPerformance[lp]
          case 'KPL':
              this.KPL = this.trainPerformance[lp]
          case 'MEL':
              this.MEL = this.trainPerformance[lp]
          case 'WRL':
              this.WRL = this.trainPerformance[lp]
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
  ngOnDestroy(){
    this.trainPerformanceSubscription.unsubscribe();
  }
}

