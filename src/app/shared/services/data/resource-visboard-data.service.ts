import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class ResourceVisboardDataService {

    constructor(private http: Http) {}
  
    getHeadCountData = () => {
        return Observable
        .timer(0)
        .switchMap(() => this.http.get('http://10.44.0.124:4000/api/visboardHeadcount').map((response: Response) => response.json()))
    }
    getAnnualLeaveData = () => {
        return Observable
        .timer(0)
        .switchMap(() => this.http.get('http://10.44.0.124:4000/api/visboardAnnualLeave').map((response: Response) => response.json()))
    }
    getSicknessData = () => {
        return Observable
        .timer(0)
        .switchMap(() => this.http.get('http://10.44.0.124:4000/api/visboardSickness').map((response: Response) => response.json()))
    }
    getAltDutiesData = () => {
        return Observable
        .timer(0)
        .switchMap(() => this.http.get('http://10.44.0.124:4000/api/visboardAltDuties').map((response: Response) => response.json()))
    }
}
