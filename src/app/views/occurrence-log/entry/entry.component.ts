import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { StaffService } from '../../../shared/services/data/staff.service';

@Component({
  selector: 'entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css'],
  providers: [StaffService],
})
export class EntryComponent implements OnInit {
  constructor(
    private staffservice: StaffService
  ) { }
  staffList = []
  myControl = new FormControl();

  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.staffservice.getStaffList()
    .subscribe((response) => {
      this.staffList = response.list
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.staffList.filter(option => option.toLowerCase().includes(filterValue));
  }
}

