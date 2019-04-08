import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class ChemicalsService {

  constructor(private firebase: AngularFireDatabase,
    private uiservice: UiService) {
    this.chemicallist = this.firebase.list('chemicals');
  }


  chemicallist: AngularFireList<any>;



  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    category: new FormControl(null),
    item_name: new FormControl('', Validators.required),
    Quantity: new FormControl(null),
    measurement: new FormControl(null),
  });


  getChemical() {
    this.chemicallist = this.firebase.list('chemicals');
    return this.chemicallist.snapshotChanges();
  }

  insertChemical(chemical) {
    console.log(chemical);
    this.chemicallist.push({
      category: "Chemicals",
      item_name: chemical.item_name,
      Quantity: 0,
      measurement: chemical.measurement,
    });

    this.uiservice.showSnackbar(chemical.item_name + " Created", null, 3000);
  }

  updateChemical(chemical) {
    this.chemicallist.update(chemical.$key, {
      category: chemical.category,
      item_name: chemical.item_name,
      Quantity: chemical.Quantity,
      measurement: chemical.measurement,
    })

    this.uiservice.showSnackbar("Updated to " + chemical.item_name, null, 3000);
  }

  deleteChemical($key: string, chemical) {
    this.chemicallist.remove($key);
    this.uiservice.showSnackbar(chemical.item_name + " Succesfully Deleted ", null, 3000);
  }

  // populating for edit
  populateForm(chemical) {
    this.form.setValue(chemical);
  }
}
