import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

export class currentRosterResponse {
    public Time?: string;
    public currentRosterDuties?: Array<object>;
    constructor() {}
    fromJSON(json) {
      for (var propName in json)
         this[propName] = json[propName];
      return this;
    }
  }

  export class currentRosterStatusResponse {
    public Time?: string;
    public currentRosterDayStatus?: Array<object>;
    constructor() {}
    fromJSON(json) {
      for (var propName in json)
         this[propName] = json[propName];
      return this;
    }
  }

  export class uncoveredShiftsResponse {
    public Time?: string;
    public uncoveredShifts?: Array<object>;
    constructor() {}
    fromJSON(json) {
      for (var propName in json)
         this[propName] = json[propName];
      return this;
    }
  }

  export class holisticYearResponse {
    public reportTime?: string;
    public staffId?: string;
    public year?: string;
    public sickToLeaveRatio?: number;
    public holisticYearData?: Array<object>;
    public dayCodes?: Array<object>;
    constructor() {}
    fromJSON(json) {
      for (var propName in json)
         this[propName] = json[propName];
      return this;
    }
  }

@Injectable()
export class RosterService {

    constructor(private http: HttpClient) {}
  
    getCurrentRoster = () => {
        return Observable
        .timer(0,10000)
        .switchMap(() => this.http.get('http://localhost:4000/api/currentRoster')
        .map((response: Response) => new currentRosterResponse().fromJSON(response)))
    }

    getCurrentRosterStatus = (date) => {
        return Observable
        .timer(0)
        .switchMap(() => this.http.get('http://localhost:4000/api/rosterDayStatus?date='+date.format('YYYYMMDD'))
        .map((response: Response) => new currentRosterStatusResponse().fromJSON(response)))
    }
    getUncoveredShifts = (date) => {
        return Observable
        .timer(0)
        .switchMap(() => this.http.get('http://localhost:4000/api/uncoveredShifts?date='+date.format('YYYYMMDD'))
        .map((response: Response) => new uncoveredShiftsResponse().fromJSON(response)))
    }
    getHolisticYear = (year, staffId) => {
      return Observable
      .timer(0)
      .switchMap(() => this.http.get('http://localhost:4000/api/holisticYear?year='+year+'&staffId='+staffId)
      .map((response: Response) => new holisticYearResponse().fromJSON(response)))
  }
}