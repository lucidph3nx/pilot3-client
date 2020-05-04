import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { RosterService } from '../../../shared/services/data/roster.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'shift-detail',
  templateUrl: './shift-detail.page.html',
  styleUrls: ['./shift-detail.page.css'],
  providers: [RosterService],
})
export class ShiftDetailPage implements OnInit {

  shiftSelect = new FormGroup({
    shiftId: new FormControl()
  })
  staffSelect = new FormGroup({
    staffId: new FormControl()
  })

  constructor(
    private service: RosterService,
    private route: ActivatedRoute
  ) { }
  currentRoster = []
  selectedShift;
  selectedRosterDuties = []
  selectedShiftName = ''
  selectedShiftType  = ''
  
  selectedStaffName = ''
  selectedStaffId = ''
  selectedStaffPhoto;
  sub;

  ngOnInit() {
    this.service.getRosterDuties(moment(), false)
    .subscribe((response) => {
      this.currentRoster = response.roster
      this.sub=this.route.params.subscribe(params => {
        if (params['shiftId'] !== undefined && this.shiftSelect.controls.shiftId.value == null){
          this.shiftSelect.controls.shiftId.setValue(params['shiftId'])
          this.loadData('shiftId')
        }
        if (params['staffId'] !== undefined && this.staffSelect.controls.staffId.value == null){
          this.staffSelect.controls.staffId.setValue(params['staffId'])
          this.loadData('staffId')
        }
        });
    })
  }

  loadData(from){
    if (from == 'staffId'){
      this.selectedShift = this.currentRoster.filter(area => area.staffId === this.staffSelect.controls.staffId.value.padStart(3, '0'))
      this.selectedRosterDuties = this.selectedShift[0].rosterDuties;
    } else if (from == 'shiftId'){
      this.selectedShift = this.currentRoster.filter(area => area.shiftId === this.shiftSelect.controls.shiftId.value)
      this.selectedRosterDuties = this.selectedShift[0].rosterDuties;
    }
    if (this.selectedShift.length === 0 ){
      this.selectedShiftName = ''
      this.selectedShiftType  = ''
      this.selectedStaffName = ''
      this.selectedStaffId = ''
      this.selectedStaffPhoto = undefined;
    } else {
      this.selectedShiftName = this.selectedShift[0].shiftId
      this.selectedShiftType = this.selectedShift[0].shiftType
      this.selectedStaffName = this.selectedShift[0].staffName
      this.shiftSelect.controls.shiftId.setValue(this.selectedShift[0].shiftId)
      this.selectedStaffId = this.selectedShift[0].staffId
      this.selectedStaffPhoto = 'http://'+environment.apiURL+':4000/api/staff/image?staffId='+this.selectedStaffId.padStart(3, '0')+'&height=400'
    }
  }
}

