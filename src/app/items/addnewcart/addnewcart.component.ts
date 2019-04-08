import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemAdditionService } from 'src/app/services/item-addition.service';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import { QuantitydialogComponent } from '../glassware/quantitydialog/quantitydialog.component';
import { UiService } from 'src/app/services/ui.service';
import { AvailableItemsService } from 'src/app/services/available-items.service';





@Component({
  selector: 'app-addnewcart',
  templateUrl: './addnewcart.component.html',
  styleUrls: ['./addnewcart.component.css']
})
export class AddnewcartComponent implements OnInit {
  cart11$
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
  dataavailableflag: boolean = false;
  startdate: Date;

  iscartnotempty: boolean = false;

  planModel: any = { start_time: new Date() };


  constructor(private itemAddservice: ItemAdditionService, 
    private dialog: MatDialog,
    private availableitemsservice:AvailableItemsService,
    private uiservice: UiService,
    private snackBar: MatSnackBar) {
    this.startdate = new Date;

  }

  displayedColumns: string[] = ['item_name', 'category','OriginalQuantity','Addition','actions'];


  openDialog(glassware): void {
    const dialogRef = this.dialog.open(QuantitydialogComponent, {
      width: '250px',
      data: { Quantity: this.dialogquantity }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dialogquantity = result;
      if (this.dialogquantity) {
        this.itemAddservice.Addtocartfromdialog(glassware, this.dialogquantity)
      }
      this.dialogquantity = undefined;
      this.cartitemArray = [];
    });
  }

  async ngOnInit() {
    let cart$ =(await this.itemAddservice.getvoucher()).valueChanges()
      .subscribe(item => {
        const newObj: any = item;

        //checking if cart is empty
        if (newObj.items != undefined) {
          this.iscartnotempty = true;
        } else {
          this.iscartnotempty = false;
        }
// getting and mapping cart items
        this.itemAddservice.getoriginalglasswarequantities().subscribe(origalssitem=>{
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

        this.itemAddservice.getoriginalchemicalquantities().subscribe(orichemitem=>{
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
        

        console.log(this.cartitemArray);
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
    
        if (this.cartitemArray.length > 0) {
          this.dataavailableflag = true;
        }
        // console.log(this.dataavailableflag);
      })

// Getting original glassware quantities
    this.itemAddservice.getoriginalglasswarequantities().subscribe(item => {
      this.originalglasswarequantities = item;

    })
// Getting original chemical quantities
    this.itemAddservice.getoriginalchemicalquantities().subscribe(item => {
      this.originalchemicalquantities = item;

    })

// Getting available glassware quantities
    this.availableitemsservice.getavailableglasswarequantities().subscribe(item =>{
      this.availableglasswarequantities=item;
    })
// getting available chemical quantities
    this.availableitemsservice.getavailablechemicalquantities().subscribe(item =>{
      this.availablechemicalquantities=item;
    })
  }


  // adding new or increasing the quantity of the cart
  addto(item) {
    this.itemAddservice.Addtovoucher(item);
    this.cartitemArray = [];
  }

  // subtracting items from cart
  subtractfromcart(item) {
    this.itemAddservice.subfromvoucher(item);
    this.cartitemArray = [];

  }

  onDelete($key, row) {
    if (confirm('Are you sure to delete this record ?')) {
      this.itemAddservice.removeitem($key, row)
      this.cartitemArray = [];
    }
  }





  onSubmit(form: NgForm) {
    // sending data to newadditions database
    this.itemAddservice.confirmaddition({
      Voucher_Id: form.value.voucherNo,
      Recieved_from: form.value.Recfrom,
      Date_Recieved: form.value.createdate.toDateString(),
      items: this.cartitemArrayWithoutkey,
    });


    // mapping inorder to update original and available quantities
    for (let i = 0; i < this.cartitemArray.length; i++) {
      if (this.cartitemArray[i].category == "Glassware") {
        // mapping original glassware quantities
        for (let j = 0; j < this.originalglasswarequantities.length; j++) {
          if (this.cartitemArray[i].item_name == this.originalglasswarequantities[j].item_name) {
            let updateditem = {
              $key: this.cartitemArray[i].$key,
              item_name: this.originalglasswarequantities[j].item_name,
              category: this.originalglasswarequantities[j].category,
              measurement: this.originalglasswarequantities[j].measurement,
              Quantity: (this.originalglasswarequantities[j].Quantity + this.cartitemArray[i].Quantity)
            }

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
              Quantity: (this.availableglasswarequantities[j].Quantity + this.cartitemArray[i].Quantity)
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


      if (this.cartitemArray[i].category == "Chemicals") {
        for (let j = 0; j < this.originalchemicalquantities.length; j++) {
          if (this.cartitemArray[i].item_name == this.originalchemicalquantities[j].item_name) {
            let updateditem = {
              $key: this.cartitemArray[i].$key,
              item_name: this.originalchemicalquantities[j].item_name,
              category: this.originalchemicalquantities[j].category,
              measurement: this.originalchemicalquantities[j].measurement,
              Quantity: (this.originalchemicalquantities[j].Quantity + this.cartitemArray[i].Quantity)
            }

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
              Quantity: (this.availablechemicalquantities[j].Quantity + this.cartitemArray[i].Quantity)
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
     this.itemAddservice.updateoriginalQuantities(this.updatedQuantities)
    // console.log(this.updatedQuantities)
    // updating the availablequantities
    this.availableitemsservice.updateavailableQuantities(this.updatedavailableQuantities);
    this.updatedQuantities = [];
   this.uiservice.showSnackbar("Items Successfully added", null, 3000);
     this.clearvoucart();
  }

  // Clearing the cart
  clearvoucart() {
    this.itemAddservice.clearvouchercart();
    this.cartitemArray = [];
  }





}
