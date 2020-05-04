import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

export class currentServicesResponse {
    public Time?: string;
    public currentServices?: Array<object>;
    constructor() {}
    fromJSON(json) {
      for (var propName in json)
         this[propName] = json[propName];
      return this;
    }
  }

  export class currentServerStatusResponse {
    public time?: string;
    public status?: string;
    constructor() {}
    fromJSON(json) {
      for (var propName in json)
         this[propName] = json[propName];
      return this;
    }
  }

  export class detailedCurrentServerStatusResponse {
    public time?: string;
    public status?: object;
    constructor() {}
    fromJSON(json) {
      for (var propName in json)
         this[propName] = json[propName];
      return this;
    }
  }

@Injectable()
export class CurrentServicesService {

    constructor(private http: HttpClient) {}

    getCurrentServices = () => {
        return Observable
        .timer(0,10000)
        .switchMap(() => this.http.get('http://localhost:4000/api/currentServices')
        .map((response: Response) => new currentServicesResponse().fromJSON(response)))
    }
    getCurrentServerStatus = () => {
        return Observable
        .timer(0,10000)
        .switchMap(() => this.http.get('http://localhost:4000/api/currentStatus')
        .map((response: Response) => new currentServerStatusResponse().fromJSON(response)))
    }
    getDetailedCurrentServerStatus = () => {
      return Observable
      .timer(0,10000)
      .switchMap(() => this.http.get('http://localhost:4000/api/currentStatusFull')
      .map((response: Response) => new detailedCurrentServerStatusResponse().fromJSON(response)))
  }
    
}
