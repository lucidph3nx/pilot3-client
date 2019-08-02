import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { RosterService } from '../../../shared/services/data/roster.service';


@Component({
  selector: 'staff-holistic',
  templateUrl: './staff-holistic.page.html',
  styleUrls: ['./staff-holistic.page.css'],
  providers: [RosterService],
})
export class StaffHolistic implements OnInit {

  staffId: string;
  staffPhotoURL: string;

  // lookup form
  staffSelect = new FormGroup({
    staffId: new FormControl()
  })

  constructor(
    private service: RosterService,
  ){}

  ngOnInit() {

  }

  loadData(){
    this.staffId = this.staffSelect.controls.staffId.value
    this.staffPhotoURL = 'http://localhost:4000/api/staffImage?staffId='+this.staffId.padStart(3, '0')

  }
}