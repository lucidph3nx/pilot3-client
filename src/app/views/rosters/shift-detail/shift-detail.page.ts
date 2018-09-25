import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { CurrentRosterService } from '../../../shared/services/data/current-roster.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'shift-detail',
  templateUrl: './shift-detail.page.html',
  styleUrls: ['./shift-detail.page.css'],
  providers: [CurrentRosterService],
})
export class ShiftDetailPage implements OnInit {

  shiftSelect = new FormGroup({
    shiftId: new FormControl()
  })
  staffSelect = new FormGroup({
    staffId: new FormControl()
  })

  constructor(
    private service: CurrentRosterService,
    private route: ActivatedRoute
  ) { }
  currentRoster = []
  selectedShift = []
  selectedShiftName = ''
  selectedShiftType  = ''
  
  selectedStaffName = ''
  selectedStaffId = ''
  sub;

  ngOnInit() {
    this.service.getCurrentRoster()
    .subscribe((response) => {
      this.currentRoster = response.currentRosterDuties
      this.sub=this.route.params.subscribe(params => {
        if (params['shiftId'] !== undefined){
          this.shiftSelect.controls.shiftId.setValue(params['shiftId'])
          this.loadShift()
        }
        });
    });
  }

  loadShift() {
    this.selectedShift = this.currentRoster.filter(area => area.shiftId === this.shiftSelect.controls.shiftId.value)
    if (this.selectedShift.length === 0 ){
      this.selectedShiftName = ''
      this.selectedShiftType  = ''
      this.selectedStaffName = ''
      this.selectedStaffId = ''
    } else {
      this.selectedShiftName = this.selectedShift[0].shiftId
      this.selectedShiftType = this.selectedShift[0].shiftType
      this.selectedStaffName = this.selectedShift[0].staffName
      this.selectedStaffId = this.selectedShift[0].staffId
    }
  }
  loadStaff() {
    this.selectedShift = this.currentRoster.filter(area => area.staffId === this.staffSelect.controls.staffId.value)
    if (this.selectedShift.length === 0 ){
      this.selectedShiftName = ''
      this.selectedShiftType  = ''
      this.selectedStaffName = ''
      this.selectedStaffId = ''
    } else {
      this.selectedShiftName = this.selectedShift[0].shiftId
      this.selectedShiftType = this.selectedShift[0].shiftType
      this.selectedStaffName = this.selectedShift[0].staffName
      this.selectedStaffId = this.selectedShift[0].staffId
    }
  }
}

