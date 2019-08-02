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
  currentCarList = [];
  unitsUnknown = [];
  unitsJVL = [];
  unitsKPL = [];
  unitsWRL = [];
  unitsMEL = [];

  getAgeClass({ row, column, value }): any {
    return {
      'age-warn': row.positionAgeSeconds >= 1000,
    };
  }

  updateLines(){
    this.unitsUnknown = this.currentUnitList.filter(unit => unit.line === '???')
    this.unitsJVL = this.currentUnitList.filter(unit => unit.line === 'JVILL')
    this.unitsKPL = this.currentUnitList.filter(unit => unit.line === 'NIMT')
    this.unitsWRL = this.currentUnitList.filter(unit => unit.line === 'WRAPA')
    this.unitsMEL = this.currentUnitList.filter(unit => unit.line === 'MLING')
  }

  ngOnInit() {
    this.service.getUnitList()
    .subscribe((response) => {
      this.currentUnitList = response.currentUnitList
      this.updateLines()
    });
    this.service.getCarList()
    .subscribe((response) => {
      this.currentCarList = response.currentCarList
    });
    setInterval(() => {
      for(let car of this.currentCarList) {
        car.positionAgeSeconds = car.positionAgeSeconds + 1
        car.positionAge = String(Math.floor(car.positionAgeSeconds / 60)).padStart(2, '0') + ':' + String(car.positionAgeSeconds % 60).padStart(2, '0')
      }
      this.currentUnitList = [...this.currentUnitList]; 
      this.currentCarList = [...this.currentCarList];
    },1000);
  }

}