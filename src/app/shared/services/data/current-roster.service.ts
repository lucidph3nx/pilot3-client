import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class CurrentRosterService {

    constructor(private http: Http) {}
  
    getCurrentRoster = () => {
        return Observable
        .timer(0,10000)
        .switchMap(() => this.http.get('http://10.47.16.76:4000/api/currentRoster').map((response: Response) => response.json()))
    }

}