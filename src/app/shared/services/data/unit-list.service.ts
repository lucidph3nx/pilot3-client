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

@Injectable()
export class UnitListService {

    constructor(private http: HttpClient) {}
  
    getUnitList = () => {
        return Observable
        .timer(0,10000)
        .switchMap(() => this.http.get('http://'+environment.apiURL+':4000/api/fleet/currentUnitList')
        .map((response: Response) => new unitListResponse().fromJSON(response)))
    }
    getCarList = () => {
        return Observable
        .timer(0,10000)
        .switchMap(() => this.http.get('http://'+environment.apiURL+':4000/api/fleet/currentCarList')
        .map((response: Response) => new carListResponse().fromJSON(response)))
    }

}