import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { quantitydialog } from './chemquantity.model';

@Component({
  selector: 'app-chemicalquantitydialog',
  templateUrl: './chemicalquantitydialog.component.html',
  styleUrls: ['./chemicalquantitydialog.component.css']
})
export class ChemicalquantitydialogComponent implements OnInit {

  constructor( public dialogrefchem:MatDialogRef<ChemicalquantitydialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: quantitydialog) { }

  ngOnInit() {
  }

  onNoClick(): void {
  this.dialogrefchem.close();
  }

}
