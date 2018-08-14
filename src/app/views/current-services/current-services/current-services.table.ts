import { Component, OnInit } from '@angular/core';
import { CurrentServicesService } from '../../../shared/services/data/current-services.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'current-services',
  templateUrl: './current-services.table.html',
  styleUrls: ['./current-services.table.css'],
  providers: [CurrentServicesService],
})
export class CurrentServicesTableComponent implements OnInit {
  uprows = [];
  downrows = [];
  currentServices = [];
  serverTime = moment();
  serverStatus = '';

  getVarClass({ row, column, value }): any {
    return {
      'variance-early': row.statusMessage === 'Running Early',
      'variance-okay': row.statusMessage === 'Running Ok',
      'variance-late': row.statusMessage === 'Running Late',
      'variance-verylate': row.statusMessage === 'Running Very Late',
      'variance-delayrisk': row.statusMessage.substring(0, 10) === 'Delay Risk',
      'status-awaitingdeparture': row.statusMessage === 'Awaiting Departure',
      'status-linkingissue' : row.statusMessage == 'Check OMS Linking' || row.statusMessage === 'GPS Fault',
      'status-intunnel' : row.statusMessage === 'In Rimutaka Tunnel' ||
                   row.statusMessage === 'In Tawa Tunnel' ||
                   row.statusMessage === 'In Tunnel 1' ||
                   row.statusMessage === 'In Tunnel 2',
      'status-storageroad' : row.statusMessage === 'In Storage Road' ||
                               row.statusMessage === 'In Turn Back Road',
      'status-nolink' : row.statusMessage === 'No Linked Unit',
      'status-arriving' : row.statusMessage === 'Arriving',
      'status-stoppedbetweenstations' : row.statusMessage === 'Stopped between stations',
      'status-prevdelayed' : row.statusMessage === 'Previous Service Delayed'
    };
  }
  getStnClass({ row, column, value }): any {
    return {
      'currentstation' : row.laststationcurrent == true,
    };
  }
  getSpeedClass({ row, column, value }): any {
    return {
      'status-linkingissue' : row.statusMessage == 'Check OMS Linking' ||
                              row.statusMessage === 'GPS Fault',
      'status-stoppedbetweenstations' : row.statusArray[2] === 'Stopped between stations',
      'status-storageroad' : row.statusArray[2] === 'In Storage Road' ||
                              row.statusArray[2] === 'In Turn Back Road',
    };
  }
  getAgeClass({ row, column, value }): any {
    return {
      'status-linkingissue' : row.statusMessage == 'Check OMS Linking' ||
                              row.statusMessage === 'GPS Fault',
      'status-intunnel' : row.statusArray[1] === 'In Rimutaka Tunnel' ||
                          row.statusArray[1] === 'In Tawa Tunnel' ||
                          row.statusArray[1] === 'In Tunnel 1' ||
                          row.statusArray[1] === 'In Tunnel 2',
    };
  }

  constructor(private service: CurrentServicesService) {}

  updateTable(){
    this.uprows = this.currentServices.filter(service => service.direction === 'UP')
    this.downrows = this.currentServices.filter(service => service.direction === 'DOWN')
  }

  ngOnInit() {
    this.service.getCurrentServices()
    .subscribe((response) => {
      this.currentServices = response.currentServices
      this.updateTable()
    });
    setInterval(() => {
      for(let service of this.currentServices) {
         if(service.statusMessage !== 'No Linked Unit'){
          service.locationAgeSeconds = service.locationAgeSeconds + 1
          service.locationAge = moment().hour(0).minute(0).seconds(service.locationAgeSeconds).format('mm:ss')
         }
      }
      this.updateTable()
    },1000)
  }

}
