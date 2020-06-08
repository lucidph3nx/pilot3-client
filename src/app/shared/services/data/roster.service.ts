import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { environment } from '../../../../environments/environment';

export class currentRosterResponse {
  public Time?: string;
  public currentRosterDuties?: Array<object>;
  constructor() { }
  fromJSON(json) {
    for (var propName in json)
      this[propName] = json[propName];
    return this;
  }
}

export class currentRosterStatusResponse {
  public Time?: string;
  public currentRosterDayStatus?: Array<object>;
  constructor() { }
  fromJSON(json) {
    for (var propName in json)
      this[propName] = json[propName];
    return this;
  }
}

export class uncoveredShiftsResponse {
  public Time?: string;
  public uncoveredShifts?: Array<object>;
  constructor() { }
  fromJSON(json) {
    for (var propName in json)
      this[propName] = json[propName];
    return this;
  }
}

export class availableStaffResponse {
  public Time?: string;
  public availableStaff?: Array<object>;
  constructor() { }
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
  public holisticYearCounters?: Array<object>;
  public dayCodes?: Array<object>;
  constructor() { }
  fromJSON(json) {
    for (var propName in json)
      this[propName] = json[propName];
    return this;
  }
}

//rosterResponse
export class rosterResponse {
  public time?: string;
  public roster?: Array<{
    shiftId?: string,
    shiftType?: string,
    shiftLocation?: string,
    staffId?: string,
    staffName?: string,
    shiftCovered?: boolean,
    rosterDuties?: Array<object>;
  }>;
  constructor() { }
  fromJSON(json) {
    for (var propName in json)
      this[propName] = json[propName];
    return this;
  }
}

export class availableLeaveResponse {
  public Time?: string;
  public availableLeave?: Array<{
    date?: string,
    staffType?: string,
    location?: string,
    limit?: number,
    leaveCount?: number,
    availableLeave?: number,
  }>;
  constructor() { }
  fromJSON(json) {
    for (var propName in json)
      this[propName] = json[propName];
    return this;
  }
}

@Injectable()
export class RosterService {

  constructor(private http: HttpClient) { }

  getCurrentRoster = () => {
    return Observable
      .timer(0, 10000)
      .switchMap(() => this.http.get('http://' + environment.apiUrl + ':4000/api/currentRoster')
        .map((response: Response) => new currentRosterResponse().fromJSON(response)))
  }

  getCurrentRosterStatus = (date) => {
    return Observable
      .timer(0)
      .switchMap(() => this.http.get('http://' + environment.apiUrl + ':4000/api/roster/dayStatus?date=' + date.format('YYYYMMDD'))
        .map((response: Response) => new currentRosterStatusResponse().fromJSON(response)))
  }
  getUncoveredShifts = (date) => {
    return Observable
      .timer(0)
      .switchMap(() => this.http.get('http://' + environment.apiUrl + ':4000/api/roster/uncoveredShifts?date=' + date.format('YYYYMMDD'))
        .map((response: Response) => new uncoveredShiftsResponse().fromJSON(response)))
  }
  getAvailableStaff = (date) => {
    return Observable
      .timer(0)
      .switchMap(() => this.http.get('http://' + environment.apiUrl + ':4000/api/roster/availableStaff?date=' + date.format('YYYYMMDD'))
        .map((response: Response) => new availableStaffResponse().fromJSON(response)))
  }
  getHolisticYear = (year, staffId) => {
    return Observable
      .timer(0)
      .switchMap(() => this.http.get('http://' + environment.apiUrl + ':4000/api/staff/holisticYear?year=' + year + '&staffId=' + staffId)
        .map((response: Response) => new holisticYearResponse().fromJSON(response)))
  }
  getRosterDuties = (date, colours) => {
    return Observable
      .timer(0)
      .switchMap(() => this.http.get('http://' + environment.apiUrl + ':4000/api/roster/rosterDuties?date=' + date.format('YYYYMMDD') + '&colours='+colours)
        .map((response: Response) => new rosterResponse().fromJSON(response)))
  }
  getAvailableLeave = (dateFrom, dateTo, staffType, location) => {
    return Observable
      .timer(0)
      .switchMap(() => this.http.get('http://' + environment.apiUrl + ':4000/api/roster/availableLeave?dateFrom=' + dateFrom.format('YYYYMMDD')
                                                                                                     + '&dateTo=' + dateTo.format('YYYYMMDD')
                                                                                                     + '&staffType=' + staffType
                                                                                                     + '&location=' + location)
        .map((response: Response) => new availableLeaveResponse().fromJSON(response)))
  }
  getStaffRosterVisualiser = (dateFrom, dateTo, staffId) => {
    return Observable
      .timer(0)
      .switchMap(() => this.http.get('http://' + environment.apiUrl + ':4000/api/roster/staffRoster?'
        + 'dateFrom=' + dateFrom.format('YYYYMMDD')
          + '&dateTo=' + dateTo.format('YYYYMMDD')
          + '&staffId=' + staffId
          + '&colours=true')
          .map((response: Response) => new rosterResponse().fromJSON(response)))
  }
}