import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { egretAnimations } from "app/shared/animations/egret-animations";
import { CurrentServicesService } from '../../../shared/services/data/current-services.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import * as moment from 'moment-timezone';
import { serviceViewComponent } from './service-view/service-view.component';
import 'core-js/es7/string';

@Component({
  selector: 'current-services',
  templateUrl: './current-services.table.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./current-services.table.css'],
  providers: [CurrentServicesService],
  animations: egretAnimations
})
export class CurrentServicesTableComponent implements OnInit {
  constructor(
    private service: CurrentServicesService,
    public dialog: MatDialog,
  ) {}

  uprows = [];
  downrows = [];
  currentServices = [];
  serverTime = moment();
  serverStatus = '';

  getVarClass({ row, column, value }): any {
    return {
      'variance-early': row.statusArray[0] === 'Running Early',
      'variance-okay': row.statusArray[0] === 'Running Ok',
      'variance-late': row.statusArray[0] === 'Running Late',
      'variance-verylate': row.statusArray[0] === 'Running Very Late',
      'variance-delayrisk': row.statusArray[0].substring(0, 10) === 'Delay Risk',
    };
  }
  getStatusClass({ row, column, value }): any {
    return {
      'status-early': row.statusMessage === 'Running Early',
      'status-okay': row.statusMessage === 'Running Ok',
      'status-late': row.statusMessage === 'Running Late',
      'status-verylate': row.statusMessage === 'Running Very Late',
      'status-delayrisk': row.statusMessage.substring(0, 10) === 'Delay Risk',
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
      'currentstation' : row.lastStationCurrent == true,
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

  updateTable(){
    this.uprows = this.currentServices.filter(service => service.direction === 'UP')
    this.downrows = this.currentServices.filter(service => service.direction === 'DOWN')
  }

  openServiceView(e){
    if ( e.type == "click" ) {
      const dialogRef: MatDialogRef<any> = this.dialog.open(serviceViewComponent, {
        width: '720px',
        //disableClose: true,
        data: e.row
      })
    }
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
          service.locationAge = String(Math.floor(service.locationAgeSeconds / 60)).padStart(2, '0') + ':' + String(service.locationAgeSeconds % 60).padStart(2, '0')
          }
         
      }
      this.updateTable()
    },1000);
  }



}
