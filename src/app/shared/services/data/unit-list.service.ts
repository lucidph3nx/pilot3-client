import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { environment } from '../../../../environments/environment';

export class unitListResponse {
    public Time?: string;
    public currentUnitList?: Array<object>;
    constructor() {}
    fromJSON(json) {
      for (var propName in json)
         this[propName] = json[propName];
      return this;
    }
  }

  export class carListResponse {
    public Time?: string;
    public currentCarList?: Array<object>;
    constructor() {}
    fromJSON(json) {
      for (var propName in json)
         this[propName] = json[propName];
      return this;
    }
  }
  export class NISListResponse {
    public Time?: string;
    public currentNISList?: Array<object>;
    public matangiNISCount?: number;
    constructor() {}
    fromJSON(json) {
      for (var propName in json)
         this[propName] = json[propName];
      return this;
    }
  }

  export class HistoricNISResponse {
    public Time?: string;
    public requestedDay?: string;
    public graphNISData?: Array<object>;
    public dayNISList?: Array<object>;
    constructor() {}
    fromJSON(json) {
      for (var propName in json)
         this[propName] = json[propName];
      return this;
    }
  }

@Injectable()
export class UnitListService {
  constructor(private http: HttpClient) {}

  getUnitList = () => {
      return Observable
      .timer(0,10000)
      .switchMap(() => this.http.get('http://'+environment.apiUrl+':4000/api/fleet/currentUnitList')
      .map((response: Response) => new unitListResponse().fromJSON(response)))
  }
  getCarList = () => {
      return Observable
      .timer(0,10000)
      .switchMap(() => this.http.get('http://'+environment.apiUrl+':4000/api/fleet/currentCarList')
      .map((response: Response) => new carListResponse().fromJSON(response)))
  }
  getCurrentNISList = () => {
    return Observable
    .timer(0,60000)
    .switchMap(() => this.http.get('http://'+environment.apiUrl+':4000/api/fleet/currentNISList')
    .map((response: Response) => new NISListResponse().fromJSON(response)))
  }
  getHistoricNIS = (date) => {
    return Observable
    .timer(0)
    .switchMap(() => this.http.get('http://'+environment.apiUrl+':4000/api/fleet/historicNIS?date='+date.format("YYYYMMDD"))
    .map((response: Response) => new HistoricNISResponse().fromJSON(response)))
  }
}