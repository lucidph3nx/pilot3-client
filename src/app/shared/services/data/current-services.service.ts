import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class CurrentServicesService {

    constructor(private http: Http) {}
  

    getCurrentServices = () => {
        return Observable
        .timer(0,10000)
        .switchMap(() => this.http.get('/api/currentServices').map((response: Response) => response.json()))
    }
    getCurrentServerStatus = () => {
        return Observable
        .timer(0,10000)
        .switchMap(() => this.http.get('/api/currentStatus').map((response: Response) => response.json()))

    }

}