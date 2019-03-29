import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import {Subject, Observable} from 'rxjs';
import { first, take, map } from 'rxjs/operators';
import { Addvoucher } from './addvoucher.model';

@Injectable({
  providedIn: 'root'
})
export class ItemAdditionService {

  vocucherlist: AngularFireList <any> 
  addvoucher: AngularFireObject<any>;
  glasswarelist: AngularFireList <any>;
  chemicalist:AngularFireList <any>;
  
  constructor(private db:AngularFireDatabase,private firebase:AngularFireDatabase) { 
    this.vocucherlist = db.list('Addvouchers');
    this.glasswarelist=this.firebase.list('glassware');
    this.chemicalist=this.firebase.list('chemicals');

  }
// Creating a new vouchercart if no voucher is present
  private newvoucher(){
   return this.db.list('/new-additions-cart').push({
      dateTimeCreated:new Date().getTime()
    })
  }
  
// Getting vouchercart asynchronously
  async  getvoucher(){
    let voucherid= await this.getOrCreateAddVoucherId().catch(error=>{
      console.log(error);
    });
    return this.db.object('/new-additions-cart/' +voucherid)

  }

// Getting voucherid synchronously
  getvouchersync(){
    let Addvoucherid=localStorage.getItem('Addvoucherid');
    return this.db.object('/new-additions-cart/' +Addvoucherid).valueChanges()
  }


// Getting exisiting vouchercartid or creating one
  private async getOrCreateAddVoucherId():Promise<string>{
    let Addvoucherid=localStorage.getItem('Addvoucherid');
    if(Addvoucherid)  return Addvoucherid;
    let result=await this.newvoucher();
    localStorage.setItem('Addvoucherid',result.key);
    return result.key;

  }
// Getting item
  private getItem(AddvoucherId:string,itemId:string){
   return this.db.object('/new-additions-cart/' +AddvoucherId +'/items/' +itemId );
  }
// Adding new item or increasing count
  async Addtovoucher(item1){
    let AddvoucherId=await this.getOrCreateAddVoucherId();
    let item$=this.getItem(AddvoucherId,item1.$key )
    item$.valueChanges().pipe(take(1)).subscribe(item =>{

      const newObj: any = item;
      if(item!=null){
        item$.update(
          {item_name:item1.item_name,
            category:item1.category,
            measurement:item1.measurement,
          Quantity:(newObj.Quantity)+1});
      }else{
         item$.set({item_name:item1.item_name,
          category:item1.category,
          measurement:item1.measurement,
          Quantity:1});
      }
    })
  }

  async Addtocartfromdialog(item1,dQuantity){
    let AddvoucherId=await this.getOrCreateAddVoucherId();
    let item$=this.getItem(AddvoucherId,item1.$key )
    item$.valueChanges().pipe(take(1)).subscribe(item =>{

      const newObj: any = item;
      if(item!=null){
        item$.update(
          {item_name:item1.item_name,
            category:item1.category,
            measurement:item1.measurement,
          Quantity:dQuantity});
      }else{
         item$.set({item_name:item1.item_name,
          category:item1.category,
          measurement:item1.measurement,
          Quantity:dQuantity});
      }
    })
  }
  
// subtracting or removing items form cart
  async subfromvoucher(item1){
    let AddvoucherId=await this.getOrCreateAddVoucherId();
    let item$=this.getItem(AddvoucherId,item1.$key)
    item$.valueChanges().pipe(take(1)).subscribe(item =>{
   
      const newObj: any = item;
      if(newObj.Quantity==1){
         this.db.object('/new-additions-cart/' + AddvoucherId + '/items/' + item1.$key).remove();
         return
      }
      if(item!=null){
        item$.update(
          {item_name:item1.item_name,
            category:item1.category,
            measurement:item1.measurement,
          Quantity:(newObj.Quantity)-1});
      }else{
 
         item$.set({item_name:item1.item_name,
          category:item1.category,
          measurement:item1.measurement,
          Quantity:1});
      }
    })
  }

  // Confirm submition
  confirmaddition(vocuher:Addvoucher){
    console.log(this.vocucherlist);
    this.vocucherlist.push({
      Voucher_Id: vocuher.Voucher_Id,
      Recieved_from:vocuher.Recieved_from,
      Date_Recieved:vocuher.Date_Recieved.toString(),
      items:vocuher.items
    });
  }

  // Getting original quantities in order to update
  getoriginalglasswarequantities(){
    this.glasswarelist=this.firebase.list('glassware');
    return this.glasswarelist.valueChanges();
  }

  getoriginalchemicalquantities(){
    this.chemicalist=this.firebase.list('chemicals');
    return this.chemicalist.valueChanges();
  }

// clearing the cart in database
  async clearvouchercart(){
      let vouId = await this.getOrCreateAddVoucherId();
      this.db.object('/new-additions-cart/' + vouId + '/items').remove();
  }

  // Get submitted vouchers
  getaddvouchers(){
    this.vocucherlist=this.db.list('Addvouchers');
    return this.vocucherlist.valueChanges();
  }
 
// Updating original quantities
  updateoriginalQuantities(data){
    console.log(data)
    for(let i=0;i<data.length;i++)
    {
      if(data[i].category=="Glassware"){
      this.glasswarelist.update(
        data[i].$key,{
        item_name: data[i].item_name,
        Quantity:data[i].Quantity
      })
    }
    if(data[i].category=="Chemicals"){
      this.chemicalist.update(
        data[i].$key,{
        item_name: data[i].item_name,
        Quantity:data[i].Quantity
      })
    }
    }
  }
}

  



