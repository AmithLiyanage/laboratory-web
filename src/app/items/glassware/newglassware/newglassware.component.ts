import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl} from '@angular/forms';
import {MatDialogRef} from '@angular/material'


import { ItemService } from 'src/app/services/glassware.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-newglassware',
  templateUrl: './newglassware.component.html',
  styleUrls: ['./newglassware.component.css']
})
export class NewglasswareComponent implements OnInit {
items:any;
  constructor(private service:ItemService,
    public dialogRef:MatDialogRef<NewglasswareComponent>,
    private uiservice:UiService) { }

  ngOnInit() {
   this.service.getGlasswareitems().subscribe(item=>{
     this.items=item;
   });
   
   
  }


  
  onSubmit(){

    let flag=true;
    // console.log(this.items)
    for(let i=0;i<this.items.length;i++){
      // let k=(this.items[i].item_name).toString().toLowerCase().trim();
      // console.log((this.items[i].item_name).toString().replace(/\s/g, "").toLowerCase());
      let k=this.service.form.value.item_name.toString().replace(/\s/g, "").toLowerCase();
      let y=this.items[i].item_name.toString().replace(/\s/g, "").toLowerCase();
      //  console.log(k)
      //  console.log(y)

      //  console.log(this.items[i].item_name)
      if(k==y){
        flag=false;
        this.uiservice.showSnackbar(this.items[i].item_name +" Already exists",null,3000);
        
      }

    }
    if(this.service.form.valid && flag==true){
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
