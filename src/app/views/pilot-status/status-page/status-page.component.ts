import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../../shared/services/data/services.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'status-page',
  templateUrl: './status-page.component.html',
  styleUrls: ['./status-page.component.css'],
  providers: [ServicesService],
})


export class StatusPageComponent implements OnInit {

  constructor(
    private service: ServicesService,
  ) { }
  private serviceSubscription;
  geVisStatusMessage: string;
  geVisStatusTime: string;
  VDSStatusMessage: string;
  VDSStatusTime: string;
  compassStatusMessage: string;
  compassStatusTime: string;
  metserviceStatusMessage: string;
  metserviceStatusTime: string;

  ngOnInit() {
    this.serviceSubscription = this.service.getCurrentServerStatus()
    .subscribe((response) => {
      const serverStatus = new ServerStatus().fromJSON(response.integrations)
      const geVisStatus = new integrationStatus().fromJSON(serverStatus.GEVIS)
      this.geVisStatusMessage = geVisStatus.message
      this.geVisStatusTime = moment(geVisStatus.updateTime).format('DD/MM/YYYY HH:mm:ss')
      const VDSStatus = new integrationStatus().fromJSON(serverStatus.VDS)
      this.VDSStatusMessage = VDSStatus.message
      this.VDSStatusTime = moment(VDSStatus.updateTime).format('DD/MM/YYYY HH:mm:ss')
      const compassStatus = new integrationStatus().fromJSON(serverStatus.COMPASS)
      this.compassStatusMessage = compassStatus.message
      this.compassStatusTime = moment(compassStatus.updateTime).format('DD/MM/YYYY HH:mm:ss')
      const metserviceStatus = new integrationStatus().fromJSON(serverStatus.METSERVICE)
      this.metserviceStatusMessage = metserviceStatus.message
      this.metserviceStatusTime = moment(metserviceStatus.updateTime).format('DD/MM/YYYY HH:mm:ss')
    });
  }
  ngOnDestroy(){
    this.serviceSubscription.unsubscribe();
  }

}

export class ServerStatus {
  public GEVIS?: object;
  public VDS?: object;
  public COMPASS?: object;
  public METSERVICE?: object;
  constructor() {}
  fromJSON(json) {
    for (var propName in json)
       this[propName] = json[propName];
    return this;
  }
}

export class integrationStatus {
  public message?: string;
  public updateTime?: string;
  constructor() {}
  fromJSON(json) {
    for (var propName in json)
       this[propName] = json[propName];
    return this;
  }
}