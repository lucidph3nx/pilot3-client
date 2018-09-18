import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'service-view',
  templateUrl: './service-view.component.html',
  styleUrls: ['./service-view.component.css']
})
export class serviceViewComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<serviceViewComponent>,
  ) {}
  service = {};

  ngOnInit() {
    this.service = this.data
  }
  onClose() {
    this.dialogRef.close();
    console.log("closing command given")
  }
}
