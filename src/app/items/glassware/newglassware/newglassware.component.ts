import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl} from '@angular/forms';
import {MatDialogRef} from '@angular/material'


import { ItemService } from 'src/app/services/glassware.service';

@Component({
  selector: 'app-newglassware',
  templateUrl: './newglassware.component.html',
  styleUrls: ['./newglassware.component.css']
})
export class NewglasswareComponent implements OnInit {

  constructor(private service:ItemService,
    public dialogRef:MatDialogRef<NewglasswareComponent>) { }

  ngOnInit() {
     this.service.getGlassware();
  }


  
  onSubmit(){
    if(this.service.form.valid){
      if(!this.service.form.get('$key').value)
        this.service.insertGlassware(this.service.form.value);
      else
        this.service.updateGlassware(this.service.form.value);;
      this.service.form.reset();
       this.onClose();
      }
  }
// Dialog close
  onClose(){
    this.service.form.reset();
    this.dialogRef.close()
  }
}
