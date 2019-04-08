import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LendingServiceService } from 'src/app/services/lending-service.service';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { AvailableItemsService } from 'src/app/services/available-items.service';
import { UiService } from 'src/app/services/ui.service';
import { LendingquantitydialogComponent } from '../lendingquantitydialog/lendingquantitydialog.component';

export interface Teacher {
  name: string;
  Gender: string;
}

@Component({
  selector: 'app-lending-main-form',
  templateUrl: './lending-main-form.component.html',
  styleUrls: ['./lending-main-form.component.css']
})
export class LendingMainFormComponent implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  iscartnotempty:boolean;
  lendingcartarray:any[]=[];
  updatedtablearry:any[]=[];
  quantity: number;

  availableglassware:any[]=[];
  lendingcartitemarraywithoutkey:any[]=[];
  listData: MatTableDataSource<any>;
  dataavailableflag:boolean;


   planModel: any = { start_time: new Date() };

  constructor(private _formBuilder: FormBuilder,
    private itemlendingservice:LendingServiceService,
    private availableservice:AvailableItemsService,
    private dialog: MatDialog,
    private uiservice:UiService) {}

  async ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['',]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['',]
    });




    let cart$ =(await this.itemlendingservice.getlendingcart()).valueChanges()
    .subscribe(item => {
 
      // console.log(this.updatedtablearry);
      const newObj: any = item;
      // console.log(item);
      //checking if cart is empty
      if (newObj.items != undefined) {
        this.iscartnotempty = true;
      } else {
        this.iscartnotempty = false;
      }
// getting and mapping cart items
      for (let item in newObj.items) {
        let obj = {
          $key: item,
          item_name: newObj.items[item].item_name,
          category: newObj.items[item].category,
          measurement: newObj.items[item].measurement,
          Quantity: newObj.items[item].Quantity
        }
  
        this.lendingcartarray.push(obj);

      }
      let array = this.lendingcartarray.map(list => {
        return {
          item_name: list.item_name,
          category: list.category,
          measurement: list.measurement,
          Quantity: list.Quantity,
        };

      }

      )
      this.lendingcartitemarraywithoutkey = array;
      // console.log(this.lendingcartarray);

      this.availableservice.getAvailableGlasswareitems().subscribe(item=>{
      
        this.availableglassware=item;
        // console.log(this.lendingcartarray)
        for(let i=0;i<this.lendingcartarray.length;i++){
     
        if(this.lendingcartarray[i].category=="Glassware"){
            for(let j=0;j<item.length;j++){
              if(this.lendingcartarray[i].item_name==item[j].item_name){
                let updatedtableobject = {
                  $key: this.lendingcartarray[i].$key,
                  item_name: item[j].item_name,
                  category: item[j].category,
                  measurement: item[j].measurement,
                  availablequantity:item[j].Quantity,
                  Quantity: (this.lendingcartarray[i].Quantity)
                }
                this.updatedtablearry.push(updatedtableobject);
                     
        }
      }
     
        }
        
        }
       
      })
      // console.log(this.updatedtablearry);

      this.availableservice.getAvailablechemicalitems().subscribe(item=>{
        this.availableglassware=item;
        // console.log(this.lendingcartarray)
        for(let i=0;i<this.lendingcartarray.length;i++){
     
        if(this.lendingcartarray[i].category=="Chemicals"){
       
            for(let j=0;j<item.length;j++){
              if(this.lendingcartarray[i].item_name==item[j].item_name){
                let updatedtableobject = {
                  $key: this.lendingcartarray[i].$key,
                  item_name: item[j].item_name,
                  category: item[j].category,
                  measurement: item[j].measurement,
                  availablequantity:item[j].Quantity,
                  Quantity: (this.lendingcartarray[i].Quantity)
                }
                this.updatedtablearry.push(updatedtableobject);
             


          this.listData = new MatTableDataSource(this.updatedtablearry);
         
        }
      }
     
        }
        
        }
       
      })
      
      
      if (this.lendingcartarray.length > 0) {
        this.dataavailableflag = true;
      }
      //  console.log(this.lendingcartarray);
    })
// adding available quantities to the array


     console.log(this.availableglassware);

    
    
  }

    //  Quantity dialog
    openDialog(item): void {

      const dialogRef = this.dialog.open(LendingquantitydialogComponent, {
        width: '250px',
        data: { Quantity: this.quantity }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.quantity = result;
  //  console.log(item.Quantity)
          if (this.quantity) {
            this.itemlendingservice.Addtocartfromdialog(item, this.quantity)
          }
          else{
            this.uiservice.showSnackbar("Cant lend more than available",null,3000);
          }
          this.updatedtablearry = [];
          this.lendingcartarray=[];
          this.quantity = undefined;
        }
      )
        ;
    }


  displayedColumns: string[] = ['item_name', 'AvailableQuantity', 'lendquantity'];

   today: number = Date.now();
  // teachers
  Teachers: Teacher[] = [
    {name: 'Teacher 1', Gender: 'Female'},
    {name: 'Teacher 2', Gender: 'Male'},
    {name: 'Teacher 3', Gender: 'Female'}
  ];


  addto(item) {
    this.itemlendingservice.Addtolendingcart(item);
    this.updatedtablearry = [];
    this.lendingcartarray=[];
  }

  // subtracting items from cart
  subtractfromcart(item) {
    this.itemlendingservice.subfromlendingcart(item);
    this.updatedtablearry = [];
    this.lendingcartarray=[];
    console.log(this.updatedtablearry);

  }

  onQuantitysubmit(){
    this.updatedtablearry = [];
    this.lendingcartarray=[]; 
  }
}
