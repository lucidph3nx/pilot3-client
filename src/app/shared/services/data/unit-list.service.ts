import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class UnitListService {

    constructor(private http: Http) {}
  
    getUnitList = () => {
        return Observable
        .timer(0,10000)
        .switchMap(() => this.http.get('http://10.47.16.76:4000/api/currentUnitList').map((response: Response) => response.json()))
    }
    getCarList = () => {
        return Observable
        .timer(0,10000)
        .switchMap(() => this.http.get('http://10.47.16.76:4000/api/currentCarList').map((response: Response) => response.json()))
    }

}