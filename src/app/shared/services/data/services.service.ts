import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { environment } from '../../../../environments/environment';



export class CurrentServicesResponse {
  public Time?: string;
  public currentServices?: Array<object>;
  constructor() { }
  fromJSON(json) {
    for (var propName in json)
      this[propName] = json[propName];
    return this;
  }
}

export class CurrentServerStatusResponse {
  public time?: string;
  public status?: string;
  public integrations?: object;
  constructor() { }
  fromJSON(json) {
    for (var propName in json)
      this[propName] = json[propName];
    return this;
  }
}


export class TimeDistanceResponse {
  public time?: string;
  public timeDistance?: {
    date?: string;
    line?: string;
    plannedTimeDistancePoints?: Array<object>;
    actualTimeDistancePoints?: Array<object>;
  }
  constructor() { }
  fromJSON(json) {
    for (var propName in json)
      this[propName] = json[propName];
    return this;
  }
}
export class ServiceDetailResponse {
  public time?: string;
  public serviceDetail?: {
    date?: string;
    serviceId?: string;
    line?: string;
    peak?: boolean;
    direction?: string;
    consist?: Array<string>;
    punctualityFailure?: boolean;
    reliabilityFailure?: boolean;
    busReplaced?: boolean;
    departs?: string;
    origin?: string;
    arrives?: string;
    destination?: string;
    delayOverall?: number;
    delayBreakdown?: {
      origin?: number;
      TSR?: number;
      betweenStations?: number;
      atStations?: number;
    };
    timingPoints?: Array<object>;
    crew?: Array<object>;
    TSRList?: Array<object>;
  };
  constructor() { }
  fromJSON(json) {
    for (var propName in json)
      this[propName] = json[propName];
    return this;
  }
}

@Injectable()
export class ServicesService {

  constructor(private http: HttpClient) { }

  getCurrentServices = () => {
    return Observable
      .timer(0, 10000)
      .switchMap(() => this.http.get('http://' + environment.apiUrl + ':4000/api/services/current')
        .map((response: Response) => new CurrentServicesResponse().fromJSON(response)))
  }
  getServiceDetail = (date, serviceId) => {
    return Observable
      .timer(0)
      .switchMap(() => this.http.get('http://' + environment.apiUrl + ':4000/api/services/detail?date=' + date + '&serviceId=' + serviceId)
        .map((response: Response) => new ServiceDetailResponse().fromJSON(response)))
  }
  getCurrentServerStatus = () => {
    return Observable
      .timer(0, 10000)
      .switchMap(() => this.http.get('http://' + environment.apiUrl + ':4000/api/serverStatus/current')
        .map((response: Response) => new CurrentServerStatusResponse().fromJSON(response)))
  }
  getTimeDistance = (date, lineId) => {
    return Observable
      .timer(0)
      .switchMap(() => this.http.get('http://' + environment.apiUrl + ':4000/api/services/timeDistance?date=' + date + '&line=' + lineId)
        .map((response: Response) => new TimeDistanceResponse().fromJSON(response)))
  }

}
