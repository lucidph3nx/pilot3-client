import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { environment } from '../../../../environments/environment';

export class staffDetailsResponse {
  public Time?: string;
  public staffDetails?: {
    staffId?: string;
    staffName?: string;
    birthDate?: string;
    startDate?: string;
    exitDate?: string;
    activeDirectoryId?: string;
    photoURL?: string;
    phone1?: string;
    phone2?: string;
    currentRoster?: Array<object>;
  };
  constructor() { }
  fromJSON(json) {
    for (var propName in json)
      this[propName] = json[propName];
    return this;
  }
}

export class staffListResponse {
  public Time?: string;
  public list?: Array<string>;
  
  constructor() { }
  fromJSON(json) {
    for (var propName in json)
      this[propName] = json[propName];
    return this;
  }
}

@Injectable()
export class StaffService {

  constructor(private http: HttpClient) { }

  getStaffDetail = (staffId) => {
    return Observable
      .timer(0)
      .switchMap(() => this.http.get('http://' + environment.apiUrl + ':4000/api/staff/details?staffId=' + staffId)
        .map((response: Response) => new staffDetailsResponse().fromJSON(response)))
  }
  getStaffList = () => {
    return Observable
      .timer(0)
      .switchMap(() => this.http.get('http://' + environment.apiUrl + ':4000/api/staff/list')
        .map((response: Response) => new staffListResponse().fromJSON(response)))
  }
}