import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class RosterStatusService {

    constructor(private http: Http) {}
  
    getCurrentRosterStatus = (date) => {
        return Observable
        .timer(0)
        .switchMap(() => this.http.get('http://10.44.0.124:4000/api/rosterDayStatus?date='+date.format('YYYYMMDD')).map((response: Response) => response.json()))
    }
    getUncoveredShifts = (date) => {
        return Observable
        .timer(0)
        .switchMap(() => this.http.get('http://10.44.0.124:4000/api/uncoveredShifts?date='+date.format('YYYYMMDD')).map((response: Response) => response.json()))
    }
}
