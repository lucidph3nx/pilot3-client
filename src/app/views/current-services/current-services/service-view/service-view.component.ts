import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from "@angular/router";

@Component({
  selector: 'service-view',
  templateUrl: './service-view.component.html',
  styleUrls: ['./service-view.component.css']
})
export class serviceViewComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<serviceViewComponent>,
    private router: Router
  ) {}
  service = {};

  ngOnInit() {
    this.service = this.data
  }
  onClose() {
    this.dialogRef.close();
  }
  showDayRoster(event, shiftId){
    this.router.navigate(['rosters/shift-detail',{shiftId: shiftId}])
    this.dialogRef.close();
  }

}
