import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { NewglasswareComponent } from '../../glassware/newglassware/newglassware.component';
import { ChemicalsService } from 'src/app/services/chemicals.service';
import { ItemAdditionService } from 'src/app/services/item-addition.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-newchemicalsdialog',
  templateUrl: './newchemicalsdialog.component.html',
  styleUrls: ['./newchemicalsdialog.component.css']
})
export class NewchemicalsdialogComponent implements OnInit {
  items: any;
  constructor(private chemservice: ChemicalsService,
    private ItemAddService: ItemAdditionService,
    public dialogRef: MatDialogRef<NewchemicalsdialogComponent>,
    private uiservice: UiService
  ) { }

  async ngOnInit() {
    this.chemservice.getChemical().subscribe(
      list => {
        let array = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          };
        });
        this.items = array;
        console.log(array)

      }
    )
  }

  measurement = 'ml';


  onSubmit() {
    console.log(this.items)
    // catching if alreadt exists
    let flag = true;
    for (let i = 0; i < this.items.length; i++) {
      let k = this.chemservice.form.value.item_name.toString().replace(/\s/g, "").toLowerCase();
      let y = this.items[i].item_name.toString().replace(/\s/g, "").toLowerCase();
      if (k == y) {
        flag = false;
        this.uiservice.showSnackbar(this.items[i].item_name + " Already exists", null, 3000);
      }
    }

    if (this.chemservice.form.valid && flag == true) {
      if (!this.chemservice.form.get('$key').value)
        this.chemservice.insertChemical(this.chemservice.form.value);
      else
        this.chemservice.updateChemical(this.chemservice.form.value);;
      this.chemservice.form.reset();
      this.onClose();
    }
  }
  // Dialog close
  onClose() {
    this.chemservice.form.reset();
    this.dialogRef.close()
  }
}
