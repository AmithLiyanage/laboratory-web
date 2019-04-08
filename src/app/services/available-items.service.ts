import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AvailableItemsService {

  glasswareRef: AngularFireList<any>;
  chemicalRef: AngularFireList<any>;
  items: Observable<any[]>;
  availableitems;
  constructor(private firebase: AngularFireDatabase) {
    this.glasswareRef= firebase.list('available_glassware');
    this.chemicalRef= firebase.list('available_chemicals');
    
        // Use snapshotChanges().map() to store the key
        this.items = this.glasswareRef.snapshotChanges().pipe(
          map(changes => 
            changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
          )
        );
        this.items.subscribe(item=>{
          this.availableitems=item;
        })
      
  }

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    category: new FormControl(null),
    item_name: new FormControl('', Validators.required),
    Quantity: new FormControl(null),
    measurement: new FormControl(null),
  });

  // adding to available glassware
  addtoAvailableGlassware(glassware) {
    console.log(this.glasswareRef);
    this.glasswareRef.push({
      category: "Glassware",
      item_name: glassware.item_name,
      Quantity: 0,
      measurement: "units",
    });
  }

  // updating available glassware
  // updateAvailableGlassware(glassware) {
   
  //   this.glasswareRef.update(glassware.$key, {
  //     category: glassware.category,
  //     item_name: glassware.item_name,
  //     Quantity: glassware.Quantity
  //   })

  // }

  getavailableGlasswaresnap() {
    this.glasswareRef = this.firebase.list('available_glassware');
    return this.glasswareRef.snapshotChanges();
  }


  getAvailableGlasswareitems(){
    this.glasswareRef = this.firebase.list('available_glassware');
    return this.glasswareRef.valueChanges();
  }

  getavailablechemicalesnap(){
    this.chemicalRef = this.firebase.list('available_chemicals');
    return this.chemicalRef.snapshotChanges();
  }

  
  getAvailablechemicalitems(){
    this.chemicalRef = this.firebase.list('available_chemicals');
    return this.chemicalRef.valueChanges();
  }


  deleteavailableGlassware($key: string, glassware) {
    this.glasswareRef.remove($key);
    // console.log(this.glasswarelist[$key]);
  }


  updateavailableQuantities(data) {
     console.log(data)
     console.log(this.availableitems);
    for (let i = 0; i < data.length; i++) {
      if (data[i].category == "Glassware") {
        this.glasswareRef.set(
          data[i].$key, {
            item_name: data[i].item_name,
            category:data[i].category,    
            Quantity: data[i].Quantity,
            measurement:data[i].measurement
          })
      }
      if (data[i].category == "Chemicals") {
        this.chemicalRef.set(
          data[i].$key, {
            item_name: data[i].item_name,
            category:data[i].category,    
            Quantity: data[i].Quantity,
            measurement:data[i].measurement
          })
      }
    }
   }
  // Getting original quantities in order to update
  getavailableglasswarequantities() {
    this.glasswareRef = this.firebase.list('available_glassware');
    return this.glasswareRef.valueChanges();
  }

  getavailablechemicalquantities() {
    this.chemicalRef = this.firebase.list('available_chemicals');
    return this.chemicalRef.valueChanges();
  }

   
  
}
