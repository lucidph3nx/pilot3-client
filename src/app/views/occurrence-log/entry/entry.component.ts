import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { StaffService } from '../../../shared/services/data/staff.service';

@Component({
  selector: 'entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css'],
  providers: [StaffService],
})
export class EntryComponent implements OnInit {

  staffList: string[] = []
  occurenceLogEntry = new FormGroup({
    textEntry: new FormControl(),
    tags: new FormControl()
  })
  // chips code
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredFruits: Observable<string[]>;
  filteredOptions: Observable<string[]>;
  occurenceEntry = new FormControl();
  occurenceCurrentText: string
  tags: string[] = []
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto2', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(
    private staffservice: StaffService
  ) {

    this.occurenceLogEntry.patchValue({tags: null})
    this.filteredFruits = this.occurenceLogEntry.get('tags').valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filterChips(fruit) : this.allFruits.slice()
      ));
    this.filteredOptions = this.occurenceLogEntry.get('textEntry').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.fruits.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.occurenceLogEntry.setValue({tags: null})
    }
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.occurenceLogEntry.setValue({tags: null})
  }

  ngOnInit() {

    this.staffservice.getStaffList()
    .subscribe((response) => {
      this.staffList = response.list
    });

  }

  saveProgress() {
    const fieldContents = this.occurenceLogEntry.value.textEntry
    console.log(fieldContents)
    this.occurenceCurrentText = fieldContents.substring(0,fieldContents.length-1)
  }

  optionSelected(e) {
    console.log(this.occurenceCurrentText)
    console.log(e.option.value)
    const newValue = {
      textEntry: (this.occurenceCurrentText + '' + e.option.value)
    }
    this.occurenceEntry.setValue(newValue)
  }

  private _filterChips(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filter(value: string): string[] {
    let filterValue = value.toLowerCase();
    if (filterValue.includes('@')){
      filterValue = filterValue.substring(filterValue.indexOf('@')+1,filterValue.length)
      return this.staffList.filter(option => option.toLowerCase().includes(filterValue));
    } else {
      return [];
    }
  }
}

