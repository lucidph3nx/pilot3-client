import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { environment } from '../../../../environments/environment';

export class headCountDataResponse {
    public Time?: string;
    public headcountData?: Array<object>;
    constructor() {}
    fromJSON(json) {
      for (var propName in json)
         this[propName] = json[propName];
      return this;
    }
  }
  export class annualLeaveDataResponse {
    public Time?: string;
    public annualLeaveData?: Array<object>;
    constructor() {}
    fromJSON(json) {
      for (var propName in json)
         this[propName] = json[propName];
      return this;
    }
  }
  export class sicknessDataResponse {
    public Time?: string;
    public sicknessData?: Array<object>;
    constructor() {}
    fromJSON(json) {
      for (var propName in json)
         this[propName] = json[propName];
      return this;
    }
  }
  export class altDutiesDataResponse {
    public Time?: string;
    public altDutiesData?: Array<object>;
    constructor() {}
    fromJSON(json) {
      for (var propName in json)
         this[propName] = json[propName];
      return this;
    }
  }
@Injectable()
export class ResourceVisboardDataService {

    constructor(private http: HttpClient) {}
  
    getHeadCountData = () => {
        return Observable
        .timer(0)
        .switchMap(() => this.http.get('http://'+environment.apiURL+':4000/api/visboardHeadcount')
        .map((response: Response) => new headCountDataResponse().fromJSON(response)))
    }
    getAnnualLeaveData = () => {
        return Observable
        .timer(0)
        .switchMap(() => this.http.get('http://'+environment.apiURL+':4000/api/visboardAnnualLeave')
        .map((response: Response) => new annualLeaveDataResponse().fromJSON(response)))
    }
    getSicknessData = () => {
        return Observable
        .timer(0)
        .switchMap(() => this.http.get('http://'+environment.apiURL+':4000/api/visboardSickness')
        .map((response: Response) => new sicknessDataResponse().fromJSON(response)))
    }
    getAltDutiesData = () => {
        return Observable
        .timer(0)
        .switchMap(() => this.http.get('http://'+environment.apiURL+':4000/api/visboardAltDuties')
        .map((response: Response) => new altDutiesDataResponse().fromJSON(response)))
    }
}
