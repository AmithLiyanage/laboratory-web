import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LendingServiceService {

  lendinglist: AngularFireList<any>
  glasswarelist: AngularFireList<any>;
  chemicalist: AngularFireList<any>;

  constructor(private firebase: AngularFireDatabase) {
    this.lendinglist = firebase.list('lendings');
    this.glasswarelist = this.firebase.list('available_glassware');
    this.chemicalist = this.firebase.list('available_chemicals');
   }

     // Creating a new vouchercart if no voucher is present
  private newlendingcart() {
    return this.firebase.list('/new-lendings-cart').push({
      dateTimeCreated: new Date().getTime()
    })
  }

  // Getting vouchercart asynchronously
  async  getlendingcart() {
    let lendingcartid = await this.getorcreatelendingcartId().catch(error => {
      console.log(error);
    });
    return this.firebase.object('/new-lendings-cart/' + lendingcartid)

  }




  // Getting exisiting vouchercartid or creating one
  private async getorcreatelendingcartId(): Promise<string> {
    let lendingcartid = localStorage.getItem('lendingcartid');
    if (lendingcartid) return lendingcartid;
    let result = await this.newlendingcart();
    localStorage.setItem('lendingcartid', result.key);
    return result.key;

  }
  // Getting item
  private getItem(lendingcartid: string, itemId: string) {
    return this.firebase.object('/new-lendings-cart/' + lendingcartid + '/items/' + itemId);
  }
  // Adding new item or increasing count
  async Addtolendingcart(item1) {
    let lendingcartid = await this.getorcreatelendingcartId();
    let item$ = this.getItem(lendingcartid, item1.$key)
    item$.valueChanges().pipe(take(1)).subscribe(item => {

      const newObj: any = item;
      if (item != null) {
        item$.update(
          {
            item_name: item1.item_name,
            category: item1.category,
            measurement: item1.measurement,
            Quantity: (newObj.Quantity) + 1
          });
      } else {
        item$.set({
          item_name: item1.item_name,
          category: item1.category,
          measurement: item1.measurement,
          Quantity: 1
        });
      }
    })
  }

  // adding to cart from the quantity dialog box
  async Addtocartfromdialog(item1, dQuantity) {
    let lendingcartid = await this.getorcreatelendingcartId();
    let item$ = this.getItem(lendingcartid, item1.$key)
    item$.valueChanges().pipe(take(1)).subscribe(item => {

      const newObj: any = item;
      if (item != null) {
        item$.update(
          {
            item_name: item1.item_name,
            category: item1.category,
            measurement: item1.measurement,
            Quantity: dQuantity
          });
      } else {
        item$.set({
          item_name: item1.item_name,
          category: item1.category,
          measurement: item1.measurement,
          Quantity: dQuantity
        });
      }
    })
    // this.uiService.showSnackbar(dQuantity + " " + "'" + item1.item_name + "'" + " items" + " Added to pending Arrivals", null, 3000);
  }

  // subtracting or removing items form cart
  async subfromlendingcart(item1) {
    let lendingcartid = await this.getorcreatelendingcartId();
    let item$ = this.getItem(lendingcartid, item1.$key)
    item$.valueChanges().pipe(take(1)).subscribe(item => {

      const newObj: any = item;
      if (newObj.Quantity == 1) {
        this.firebase.object('/new-lendings-cart/' + lendingcartid + '/items/' + item1.$key).remove();
        return
      }
      if (item != null) {
        item$.update(
          {
            item_name: item1.item_name,
            category: item1.category,
            measurement: item1.measurement,
            Quantity: (newObj.Quantity) - 1
          });
      } else {
        item$.set({
          item_name: item1.item_name,
          category: item1.category,
          measurement: item1.measurement,
          Quantity: 1
        });
      }

    })
  }




}
