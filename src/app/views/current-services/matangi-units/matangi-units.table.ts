import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UnitListService } from '../../../shared/services/data/unit-list.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'matangi-units',
  templateUrl: './matangi-units.table.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./matangi-units.table.css'],
  providers: [UnitListService],
})
export class MatangiUnitsTableComponent implements OnInit {
  constructor(
    private service: UnitListService,
  ) {}

  currentUnitList = [];

  getAgeClass({ row, column, value }): any {
    return {
      'age-warn': row.positionAgeSeconds >= 1000,
    };
  }

  ngOnInit() {
    this.service.getUnitList()
    .subscribe((response) => {
      this.currentUnitList = response.currentUnitList
    });
    setInterval(() => {
      for(let unit of this.currentUnitList) {
        unit.positionAgeSeconds = unit.positionAgeSeconds + 1
        unit.positionAge = String(Math.floor(unit.positionAgeSeconds / 60)).padStart(2, '0') + ':' + String(unit.positionAgeSeconds % 60).padStart(2, '0')
      }
      this.currentUnitList = [...this.currentUnitList];
    },1000);
  }

}