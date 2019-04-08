import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { quantitydialog } from './quantity.model';

@Component({
  selector: 'app-lendingquantitydialog',
  templateUrl: './lendingquantitydialog.component.html',
  styleUrls: ['./lendingquantitydialog.component.css']
})
export class LendingquantitydialogComponent implements OnInit {

  constructor(
    public dialogref:MatDialogRef<LendingquantitydialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: quantitydialog) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogref.close();
  }

}
