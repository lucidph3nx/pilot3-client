import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

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
    //     .switchMap(() => this.http.get('http://10.44.0.124:4000/api/currentPeakPerformance')
    //     .map((response: Response) => response.json))
    // }

    getTrainPerformance = () => {
        return Observable
        .timer(0,10000)
        .switchMap(() => this.http.get('http://10.44.0.124:4000/api/trainPerformance')
        .map((response: Response) => new trainPerformanceResponse().fromJSON(response)))
    }

}
