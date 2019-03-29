import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { quantitydialog } from './quantity.model';

@Component({
  selector: 'app-quantitydialog',
  templateUrl: './quantitydialog.component.html',
  styleUrls: ['./quantitydialog.component.css']
})
export class QuantitydialogComponent implements OnInit {

  constructor(
    public dialogref:MatDialogRef<QuantitydialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: quantitydialog) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogref.close();
  }

}
