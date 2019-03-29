import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { NewglasswareComponent } from '../../glassware/newglassware/newglassware.component';
import { ChemicalsService } from 'src/app/services/chemicals.service';
import { ItemAdditionService } from 'src/app/services/item-addition.service';

@Component({
  selector: 'app-newchemicalsdialog',
  templateUrl: './newchemicalsdialog.component.html',
  styleUrls: ['./newchemicalsdialog.component.css']
})
export class NewchemicalsdialogComponent implements OnInit {

  constructor(private chemservice:ChemicalsService,
    private ItemAddService:ItemAdditionService,
    public dialogRef:MatDialogRef<NewchemicalsdialogComponent>
  ) {}

 async ngOnInit() {
    this.chemservice.getChemical();
    
  }

  measurement='ml';


  onSubmit(){
    if(this.chemservice.form.valid){
      if(!this.chemservice.form.get('$key').value)
        this.chemservice.insertChemical(this.chemservice.form.value);
      else
        this.chemservice.updateChemical(this.chemservice.form.value);;
      this.chemservice.form.reset();
       this.onClose();
      }
  }
// Dialog close
  onClose(){
    this.chemservice.form.reset();
    this.dialogRef.close()
  }
}
