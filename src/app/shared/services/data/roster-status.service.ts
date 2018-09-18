import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class RosterStatusService {

    constructor(private http: Http) {}
  
    getCurrentRosterStatus = () => {
        return Observable
        .timer(0,10000)
        .switchMap(() => this.http.get('/api/rosterDayStatus').map((response: Response) => response.json()))
    }

}