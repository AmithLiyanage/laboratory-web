import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { take } from 'rxjs/operators';
import { remvoucher } from './remvoucher.model';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class ItemRemovalService {

  removalcartlist: AngularFireList<any>
  glasswarelist: AngularFireList<any>;
  chemicalist: AngularFireList<any>;

  constructor(private db: AngularFireDatabase,
    private firebase: AngularFireDatabase,
    private uiservice: UiService) {
    this.removalcartlist = db.list('RemoveVouchers');
    this.glasswarelist = this.firebase.list('glassware');
    this.chemicalist = this.firebase.list('chemicals');
  }

  private newRemovalCart() {
    return this.db.list('/new-removal-cart').push({
      dateTimeCreated: new Date().getTime()
    })
  }

  private async getOrCreateRemovalCartId(): Promise<string> {
    let Removalcartid = localStorage.getItem('Removalcartid');
    if (Removalcartid) return Removalcartid;
    let result = await this.newRemovalCart();
    localStorage.setItem('Removalcartid', result.key);
    return result.key;

  }

  async  getRemovecart() {
    let Removalcartid = await this.getOrCreateRemovalCartId();
    return this.db.object('/new-removal-cart/' + Removalcartid).valueChanges();
  }



  async AddtoRemovecartfromdialog(item1, dQuantity) {
    let Removalcartid = await this.getOrCreateRemovalCartId();
    let item$ = this.getItem(Removalcartid, item1.$key)
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
      this.uiservice.showSnackbar(dQuantity + " " + "'" + item1.item_name + "'" + " items" + " Added to pending Removals", null, 3000);
    })
  }

  private getItem(Removalcartid: string, itemId: string) {
    return this.db.object('/new-removal-cart/' + Removalcartid + '/items/' + itemId);
  }


  async addtoRemovecart(item1) {
    let Removalcartid = await this.getOrCreateRemovalCartId();
    let item$ = this.getItem(Removalcartid, item1.$key)
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

  async subfromRemovecart(item1) {
    console.log(item1);
    let Removalcartid = await this.getOrCreateRemovalCartId();
    let item$ = this.getItem(Removalcartid, item1.$key)
    item$.valueChanges().pipe(take(1)).subscribe(item => {

      const newObj: any = item;
      if (newObj.Quantity == 1) {
        this.db.object('/new-removal-cart/' + Removalcartid + '/items/' + item1.$key).remove();
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

  async removeitem($key: string, item) {
    let Removalcartid = await this.getOrCreateRemovalCartId();
    this.db.object('/new-removal-cart/' + Removalcartid + '/items/' + $key).remove();
    // console.log(this.glasswarelist[$key]);
  }

  // clearing the cart in database
  async clearRemovecart() {
    let Removalcartid = await this.getOrCreateRemovalCartId();
    this.db.object('/new-removal-cart/' + Removalcartid + '/items').remove();
  }

  confirmaddition(vocuher: remvoucher) {
    console.log(this.removalcartlist);
    this.removalcartlist.push({
      Voucher_Id: vocuher.Voucher_Id,
      Reason: vocuher.Reason,
      Date_Removed: vocuher.Date_Removed.toString(),
      items: vocuher.items
    });
  }

  // Getting original quantities in order to update
  getoriginalquantities() {
    this.glasswarelist = this.firebase.list('glassware');
    return this.glasswarelist.valueChanges();
  }

  updateoriginalQuantities(data) {
    console.log(data[0].$key)
    for (let i = 0; i < data.length; i++) {
      if (data[i].category == "Glassware") {
        this.glasswarelist.update(
          data[i].$key, {
            item_name: data[i].item_name,
            Quantity: data[i].Quantity
          })
      }
      if (data[i].category == "Chemicals") {
        this.chemicalist.update(
          data[i].$key, {
            item_name: data[i].item_name,
            Quantity: data[i].Quantity
          })
      }
    }
  }

  getRemvouchers() {
    this.removalcartlist = this.db.list('RemoveVouchers');
    return this.removalcartlist.valueChanges();
  }

  // Getting original quantities in order to update
  getoriginalglasswarequantities() {
    this.glasswarelist = this.firebase.list('glassware');
    return this.glasswarelist.valueChanges();
  }

  getoriginalchemicalquantities() {
    this.chemicalist = this.firebase.list('chemicals');
    return this.chemicalist.valueChanges();
  }

}
