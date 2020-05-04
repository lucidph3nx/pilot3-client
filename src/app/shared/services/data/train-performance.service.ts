import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { environment } from '../../../../environments/environment';

export class trainPerformanceResponse {
    public time?: string;
    public trainPerformance?: Array<object>;
    constructor() {}
    fromJSON(json) {
      for (var propName in json)
         this[propName] = json[propName];
      return this;
    }
  }

@Injectable()
export class TrainPerformanceService {
    constructor(private http: HttpClient) {}
    
    // getCurrentPeakPerformance = () => {
    //     return Observable
    //     .timer(0,10000)
    //     .switchMap(() => this.http.get('http://'+environment.apiURL+':4000/api/performance/currentPeak')
    //     .map((response: Response) => response.json))
    // }

    getTrainPerformance = (dateFrom, dateTo) => {
        return Observable
        .timer(0,10000)
        .switchMap(() => this.http.get('http://'+environment.apiURL+':4000/api/performance/day?dateFrom='+dateFrom.format("YYYYMMDD") +'&dateTo='+dateTo.format("YYYYMMDD"))
        .map((response: Response) => new trainPerformanceResponse().fromJSON(response)))
    }

}
