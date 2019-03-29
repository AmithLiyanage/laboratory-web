import { Injectable } from '@angular/core';
import {FormGroup,FormControl, Validators } from '@angular/forms';
import {AngularFireDatabase,AngularFireList} from 'angularfire2/database'

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private firebase:AngularFireDatabase) {
    console.log(this.glasswarelist);
  }
  glasswarelist: AngularFireList <any>;
  

  
  form:FormGroup =new FormGroup({
    $key:new FormControl(null),
    category:new FormControl(null),
    item_name:new FormControl('',Validators.required),
    Quantity:new FormControl(null),
    measurement:new FormControl(null),
  });


  getGlassware(){
    this.glasswarelist=this.firebase.list('glassware');
    return this.glasswarelist.snapshotChanges();
  }
  
  insertGlassware(glassware){
    console.log(this.glasswarelist);
    this.glasswarelist.push({
      category:"Glassware",
      item_name: glassware.item_name,
      Quantity: 0,
      measurement:"units",
    });
  }

  updateGlassware(glassware){
    this.glasswarelist.update(glassware.$key,{
      category:glassware.category,
      item_name: glassware.item_name,
      Quantity:glassware.Quantity
    })
  }

  deleteGlassware($key:string){
    this.glasswarelist.remove($key); 
  }

  // populating for edit
  populateForm(glassware){
    this.form.setValue(glassware);
  }


}


