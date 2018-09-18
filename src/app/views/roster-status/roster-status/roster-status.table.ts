import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RosterStatusService } from '../../../shared/services/data/roster-status.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import * as moment from 'moment-timezone';


@Component({
  selector: 'roster-status',
  templateUrl: './roster-status.table.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./roster-status.table.css'],
  providers: [RosterStatusService],
})
export class RosterStatusTableComponent implements OnInit {
  constructor(
    private service: RosterStatusService,
    public dialog: MatDialog,
  ) {}

  currentRosterDayStatus = []

  ngOnInit() {
    this.service.getCurrentRosterStatus()
    .subscribe((response) => {
      this.currentRosterDayStatus = response.currentRosterDayStatus
      //this.updateTable()
    });
  }
}
