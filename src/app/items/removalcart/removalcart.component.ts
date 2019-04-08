import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ItemRemovalService } from 'src/app/services/item-removal.service';
import { QuantitydialogComponent } from '../glassware/quantitydialog/quantitydialog.component';
import { NgForm } from '@angular/forms';
import { UiService } from 'src/app/services/ui.service';
import { AvailableItemsService } from 'src/app/services/available-items.service';

@Component({
  selector: 'app-removalcart',
  templateUrl: './removalcart.component.html',
  styleUrls: ['./removalcart.component.css']
})
export class RemovalcartComponent implements OnInit {
  cartitemArray: any[] = [];
  cartitemArrayWithoutkey: any[] = [];
  listData: MatTableDataSource<any>;
  originalglasswarequantities: any[] = []
  originalchemicalquantities: any[] = []
  availableglasswarequantities: any[] = []
  availablechemicalquantities: any[] = []
  updatedQuantities: any[] = []
  updatedavailableQuantities: any[] = []
  dialogquantity: number;
  quantityvalidflag: boolean = true;
  iscartnotempty: boolean = false;

  planModel: any = { start_time: new Date() };



  constructor(private itemremovalservice: ItemRemovalService, private dialog: MatDialog,
    private availableitemsservice:AvailableItemsService,
    private uiservice: UiService) { }

  async ngOnInit() {
    let cart$ = (await this.itemremovalservice.getRemovecart()).subscribe(item => {
      const newObj: any = item;
      console.log(newObj);


      //checking if cart is empty
      if (newObj.items != undefined) {
        this.iscartnotempty = true;
      } else {
        this.iscartnotempty = false;
      }
      this.itemremovalservice.getoriginalglasswarequantities().subscribe(origalssitem=>{
        for (let item in newObj.items) {
          if(newObj.items[item].category=="Glassware"){
          for(let j=0;j<origalssitem.length;j++){
            if(newObj.items[item].item_name==origalssitem[j].item_name){
          let obj = {
            $key: item,
            item_name: newObj.items[item].item_name,
            category: newObj.items[item].category,
            measurement: newObj.items[item].measurement,
            OriginalQuantity:origalssitem[j].Quantity,
            Quantity: newObj.items[item].Quantity
          }
          this.cartitemArray.push(obj);
        }
         
        }}
        }
      })

      this.itemremovalservice.getoriginalchemicalquantities().subscribe(orichemitem=>{
        for (let item in newObj.items) {
          if(newObj.items[item].category=="Chemicals"){
          for(let j=0;j<orichemitem.length;j++){
            if(newObj.items[item].item_name==orichemitem[j].item_name){
          let obj = {
            $key: item,
            item_name: newObj.items[item].item_name,
            category: newObj.items[item].category,
            measurement: newObj.items[item].measurement,
            OriginalQuantity:orichemitem[j].Quantity,
            Quantity: newObj.items[item].Quantity
          }
          this.cartitemArray.push(obj);
        }
         
        }}
        }
        this.listData = new MatTableDataSource(this.cartitemArray);
      })

      // for (let item in newObj.items) {
      //   let obj = {
      //     $key: item,
      //     item_name: newObj.items[item].item_name,
      //     category: newObj.items[item].category,
      //     measurement: newObj.items[item].measurement,
      //     Quantity: newObj.items[item].Quantity
      //   }
      //   this.cartitemArray.push(obj);
      // }

      let array = this.cartitemArray.map(list => {
        return {
          item_name: list.item_name,
          category: list.category,
          measurement: list.measurement,
          Quantity: list.Quantity,
        };

      }

      )
      this.cartitemArrayWithoutkey = array;
      console.log(this.cartitemArrayWithoutkey);
      // this.listData = new MatTableDataSource(this.cartitemArray);

    })
    // Getting original qunatities
    this.itemremovalservice.getoriginalglasswarequantities().subscribe(item => {
      this.originalglasswarequantities = item;

    })

    // Getting available glassware quantities
    this.availableitemsservice.getavailableglasswarequantities().subscribe(item =>{
      this.availableglasswarequantities=item;
    })
// getting available chemical quantities
    this.availableitemsservice.getavailablechemicalquantities().subscribe(item =>{
      this.availablechemicalquantities=item;
    })

    this.itemremovalservice.getoriginalchemicalquantities().subscribe(item => {
      this.originalchemicalquantities = item;

    })
  }

  openDialog(item): void {
    const dialogRef = this.dialog.open(QuantitydialogComponent, {
      width: '250px',
      data: { Quantity: this.dialogquantity }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dialogquantity = result;
      if (this.dialogquantity <=item.OriginalQuantity) {
        this.itemremovalservice.AddtoRemovecartfromdialog(item, this.dialogquantity)
      }else{
        this.uiservice.showSnackbar("Cannot remove more than available",null,3000);
      }
      this.dialogquantity = undefined;
      this.cartitemArray = [];
    });
  }


  displayedColumns: string[] = ['item_name','Category','OriginalQuantity', 'Addition'];


  addtoRemovecart(item) {
    this.itemremovalservice.addtoRemovecart(item);
    this.cartitemArray = [];
  }

  // subtracting items from cart
  subtractfromRemovecart(item) {
    this.itemremovalservice.subfromRemovecart(item);
    this.cartitemArray = [];

  }

  onSubmit(form: NgForm) {
    this.itemremovalservice.confirmaddition({
      Voucher_Id: form.value.voucherNo,
      Reason: form.value.Reason,
      Date_Removed: form.value.createdate.toDateString(),
      items: this.cartitemArrayWithoutkey,
    });

    for (let i = 0; i < this.cartitemArray.length; i++) {
      if (this.cartitemArray[i].category == "Glassware") {
        for (let j = 0; j < this.originalglasswarequantities.length; j++) {
          if (this.cartitemArray[i].item_name == this.originalglasswarequantities[j].item_name) {
            let updateditem = {
              $key: this.cartitemArray[i].$key,
              item_name: this.originalglasswarequantities[j].item_name,
              category: this.originalglasswarequantities[j].category,
              measurement: this.originalglasswarequantities[j].measurement,
              Quantity: (this.originalglasswarequantities[j].Quantity - this.cartitemArray[i].Quantity)
            }
            // console.log(updateditem);
            this.updatedQuantities.push(updateditem);
          }
        }
          // mapping available quantities
          if(this.availableglasswarequantities.length>0){
            let flag=false;
          for (let j = 0; j < this.availableglasswarequantities.length; j++) {
            if (this.cartitemArray[i].item_name == this.availableglasswarequantities[j].item_name) {
              flag=true;
              let updatedavailbleitem = {
                $key: this.cartitemArray[i].$key,
                item_name: this.availableglasswarequantities[j].item_name,
                category: this.availableglasswarequantities[j].category,
                measurement: this.availableglasswarequantities[j].measurement,
                Quantity: (this.availableglasswarequantities[j].Quantity - this.cartitemArray[i].Quantity)
              }
              this.updatedavailableQuantities.push(updatedavailbleitem);
            }
          }
          if(flag==false){
            let updatedavailbleitem = {
              $key: this.cartitemArray[i].$key,
              item_name: this.cartitemArray[i].item_name,
              category: this.cartitemArray[i].category,
              measurement: this.cartitemArray[i].measurement,
              Quantity: (this.cartitemArray[i].Quantity)
            }
            this.updatedavailableQuantities.push(updatedavailbleitem);
          }
        }else{
          let updatedavailbleitem = {
            $key: this.cartitemArray[i].$key,
            item_name: this.cartitemArray[i].item_name,
            category: this.cartitemArray[i].category,
            measurement: this.cartitemArray[i].measurement,
            Quantity: (this.cartitemArray[i].Quantity)
          }
          this.updatedavailableQuantities.push(updatedavailbleitem);
        }
      }

      console.log(this.originalchemicalquantities)
      if (this.cartitemArray[i].category == "Chemicals") {
        for (let j = 0; j < this.originalchemicalquantities.length; j++) {
          if (this.cartitemArray[i].item_name == this.originalchemicalquantities[j].item_name) {
            let updateditem = {
              $key: this.cartitemArray[i].$key,
              item_name: this.originalchemicalquantities[j].item_name,
              category: this.originalchemicalquantities[j].category,
              measurement: this.originalchemicalquantities[j].measurement,
              Quantity: (this.originalchemicalquantities[j].Quantity - this.cartitemArray[i].Quantity)
            }
            //  console.log(updateditem);
            this.updatedQuantities.push(updateditem);
          }
        }
        if(this.availablechemicalquantities.length>0){
          let flag=false;
        for (let j = 0; j < this.availablechemicalquantities.length; j++) {
          if (this.cartitemArray[i].item_name == this.availablechemicalquantities[j].item_name) {
            flag=true;
            let updatedavailbleitem = {
              $key: this.cartitemArray[i].$key,
              item_name: this.availablechemicalquantities[j].item_name,
              category: this.availablechemicalquantities[j].category,
              measurement: this.availablechemicalquantities[j].measurement,
              Quantity: (this.availablechemicalquantities[j].Quantity - this.cartitemArray[i].Quantity)
            }
            this.updatedavailableQuantities.push(updatedavailbleitem);
          }
        }
        if(flag==false){
          let updatedavailbleitem = {
            $key: this.cartitemArray[i].$key,
            item_name: this.cartitemArray[i].item_name,
            category: this.cartitemArray[i].category,
            measurement: this.cartitemArray[i].measurement,
            Quantity: (this.cartitemArray[i].Quantity)
          }
          this.updatedavailableQuantities.push(updatedavailbleitem);
        }
      }else{
        let updatedavailbleitem = {
          $key: this.cartitemArray[i].$key,
          item_name: this.cartitemArray[i].item_name,
          category: this.cartitemArray[i].category,
          measurement: this.cartitemArray[i].measurement,
          Quantity: (this.cartitemArray[i].Quantity)
        }
        this.updatedavailableQuantities.push(updatedavailbleitem);
      }
      }
      
    }



    if (this.quantityvalidflag == true) {
      this.itemremovalservice.updateoriginalQuantities(this.updatedQuantities);
      this.availableitemsservice.updateavailableQuantities(this.updatedavailableQuantities);
    }
    else {
      console.log("invalid removal")
    }



    this.uiservice.showSnackbar("Items Successfully Removed", null, 3000);
    this.updatedQuantities = [];

    this.clearvoucart();
  }

  // Clearing the cart
  clearvoucart() {
    this.itemremovalservice.clearRemovecart();
    this.cartitemArray = [];
  }

}
