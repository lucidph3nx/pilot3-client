import { Component, OnInit, OnDestroy, ViewEncapsulation, EventEmitter, Output, Injectable } from '@angular/core';
import { egretAnimations } from "app/shared/animations/egret-animations";
import { UnitListService } from '../../../shared/services/data/unit-list.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import * as moment from 'moment-timezone';
import 'core-js/es7/string';

@Component({
  selector: 'not-in-service',
  templateUrl: './not-in-service.table.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./not-in-service.table.css'],
  providers: [UnitListService],
  animations: egretAnimations,
})
@Injectable()
export class NotInServiceTableComponent implements OnInit {

  constructor(
    private service: UnitListService,
    public dialog: MatDialog,    
  ) {}
  private fleetSubscription;
  NISList = [];
  tableNIS = []
  tableRestricted = []
  matangiNISCount = 0;
  matangiRestrictedCount = 0;
  matangiSLA = 83 - this.matangiNISCount;
  timeUpdated = ''

  updateTable(){
    this.NISList.forEach(unit => {
      unit.reportedDate = moment(unit.reportedDate).format('YYYY-MM-DD HH:mm:ss')
    });
    this.tableNIS = this.NISList.filter(unit => unit.NIS === true);
    this.tableRestricted = this.NISList.filter(unit => unit.NIS === false);
    let matangiRestricted = this.tableRestricted.filter(unit => unit.matangi === true);
    this.matangiRestrictedCount = matangiRestricted.length
  }

  ngOnInit() {
    this.fleetSubscription = this.service.getCurrentNISList()
    .subscribe((response) => {
      this.NISList = response.currentNISList
      this.matangiNISCount = response.matangiNISCount;
      this.matangiSLA = 83 - this.matangiNISCount;
      this.timeUpdated = moment(response.Time).format('HH:mm:ss');
      this.updateTable();
    });
  }
  ngOnDestroy(){
    this.fleetSubscription.unsubscribe();
  }
}