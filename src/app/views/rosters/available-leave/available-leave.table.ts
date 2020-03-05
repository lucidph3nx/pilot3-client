import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RosterService } from '../../../shared/services/data/roster.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MatDialog, MatSnackBar, MatSelectModule } from '@angular/material';
import * as moment from 'moment-timezone';

@Component({
  selector: 'available-leave',
  templateUrl: './available-leave.table.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./available-leave.table.css'],
  providers: [RosterService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})

export class AvailableLeaveTableComponent implements OnInit {

  leaveSelect = new FormGroup({
    dateFrom: new FormControl(),
    dateTo: new FormControl(),
    staffType: new FormControl(),
    location: new FormControl()
  })

  constructor(
    private service: RosterService,
  ) { }

  staffTypeList = [
    { value: 'LE' },
    { value: 'TM' },
    { value: 'PO' },
    { value: 'RCTXO' },
    { value: 'PL' },
    { value: 'SA' }
  ];
  locationList = [
    { value: 'MAST' },
    { value: 'PK' },
    { value: 'UH' },
    { value: 'WG' },
  ];

  availableLeave = [];

  onSubmit() {
    this.service.getAvailableLeave(this.leaveSelect.value.dateFrom, this.leaveSelect.value.dateTo,
                                   this.leaveSelect.value.staffType, this.leaveSelect.value.location)
      .subscribe((response) => {
        this.availableLeave = response.availableLeave
      });
  }

  ngOnInit() {
    this.leaveSelect = new FormGroup({
      dateFrom: new FormControl('', [Validators.required]),
      dateTo: new FormControl('', [Validators.required]),
      staffType: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required])
    })
  }
}
