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
  staffList: string[] = []
  occurenceEntry = new FormControl();
  occurenceCurrentText: string
  tags: string[] = []
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.occurenceEntry.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.staffservice.getStaffList()
    .subscribe((response) => {
      this.staffList = response.list
    });

  }

  optionSelected(e) {

    console.log(e)
    //this.occurenceEntry.setValue(this.occurenceCurrentText + e.option.value)

  }

  private _filter(value: string): string[] {
    // this.occurenceCurrentText = value
    let filterValue = value.toLowerCase();
    if (filterValue.includes('@')){
      filterValue = filterValue.substring(filterValue.indexOf('@')+1,filterValue.length)
      return this.staffList.filter(option => option.toLowerCase().includes(filterValue));
    } else {
      return [];
    }

  }
}

