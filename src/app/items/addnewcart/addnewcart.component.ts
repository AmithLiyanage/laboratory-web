import { Component, OnInit } from '@angular/core';
import { ItemAdditionService } from 'src/app/services/item-addition.service';
import { DataSource } from '@angular/cdk/table';
import { ShowOnDirtyErrorStateMatcher, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import { IfStmt } from '@angular/compiler';
import { QuantitydialogComponent } from '../glassware/quantitydialog/quantitydialog.component';
import { UiService } from 'src/app/services/ui.service';
//\\ import { UiService } from 'src/app/services/ui.service';




@Component({
  selector: 'app-addnewcart',
  templateUrl: './addnewcart.component.html',
  styleUrls: ['./addnewcart.component.css']
})
export class AddnewcartComponent implements OnInit {
  cart11$
  cartitemArray:any[]=[];
  cartitemArrayWithoutkey:any[]=[];
  listData:MatTableDataSource<any>;
  originalglasswarequantities:any[]=[]
  originalchemicalquantities:any[]=[]
  updatedQuantities:any[]=[]
  dialogquantity:number;

 

  constructor(private itemAddservice:ItemAdditionService,private dialog:MatDialog,
     private uiservice:UiService,
    private snackBar: MatSnackBar) {
    
   }

   displayedColumns: string[] = ['item_name','category','Addition'];


   openDialog(glassware): void {
    const dialogRef = this.dialog.open(QuantitydialogComponent, {
      width: '250px',
      data: { Quantity: this.dialogquantity}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dialogquantity = result;
      if(this.dialogquantity){
      this.itemAddservice.Addtocartfromdialog(glassware,this.dialogquantity)
      }
      this.dialogquantity=undefined;
      this.cartitemArray=[];
    });
  }

  ngOnInit() {
    let cart$=this.itemAddservice.getvouchersync()
            .subscribe(item =>{
              const newObj: any = item;
                  
              for(let item in newObj.items){
                    let obj={$key:item,
                      item_name: newObj.items[item].item_name,
                      category: newObj.items[item].category,
                      measurement:newObj.items[item].measurement,
                      Quantity: newObj.items[item].Quantity}
                    this.cartitemArray.push(obj);
                   }

                   let array=this.cartitemArray.map(list=>{
                    return{
                      item_name:list.item_name,
                      category: list.category,
                      measurement:list.measurement,
                      Quantity:list.Quantity,
                  };
             
                   }
                   
                   )
                   this.cartitemArrayWithoutkey=array;
                   this.listData=new MatTableDataSource(this.cartitemArray);
                  
            })
       

            this.itemAddservice.getoriginalglasswarequantities().subscribe(item=>{
              this.originalglasswarequantities=item;

            })

            this.itemAddservice.getoriginalchemicalquantities().subscribe(item=>{
              this.originalchemicalquantities=item;

            })
           
          }


// adding new or increasing the quantity of the cart
addto(item){
this.itemAddservice.Addtovoucher(item);
this.cartitemArray=[];
 }

// subtracting items from cart
subtractfromcart(item){
this.itemAddservice.subfromvoucher(item);
this.cartitemArray=[];

}
        




  onSubmit(form: NgForm){
   this.itemAddservice.confirmaddition({
    Voucher_Id:form.value.voucherNo,
    Recieved_from:form.value.Recfrom,
    Date_Recieved:form.value.createdate.toDateString(),
    items:this.cartitemArrayWithoutkey,
      } );
  // console.log(this.cartitemArray);
      for(let i=0;i<this.cartitemArray.length;i++){
        console.log(this.cartitemArray[i].category);
        if(this.cartitemArray[i].category=="Glassware"){
        for(let j=0;j<this.originalglasswarequantities.length;j++){
          if(this.cartitemArray[i].item_name==this.originalglasswarequantities[j].item_name){
            let updateditem={$key:this.cartitemArray[i].$key,
              item_name:this.originalglasswarequantities[j].item_name,
              category:this.originalglasswarequantities[j].category,
              measurement:this.originalglasswarequantities[j].measurement,
              Quantity:(this.originalglasswarequantities[j].Quantity+this.cartitemArray[i].Quantity)}
            // console.log(updateditem);
            this.updatedQuantities.push(updateditem);
          }
        }
      }

      console.log(this.originalchemicalquantities)
      if(this.cartitemArray[i].category=="Chemicals"){
        for(let j=0;j<this.originalchemicalquantities.length;j++){
          if(this.cartitemArray[i].item_name==this.originalchemicalquantities[j].item_name){
            let updateditem={$key:this.cartitemArray[i].$key,
              item_name:this.originalchemicalquantities[j].item_name,
              category:this.originalchemicalquantities[j].category,
              measurement:this.originalchemicalquantities[j].measurement,
              Quantity:(this.originalchemicalquantities[j].Quantity+this.cartitemArray[i].Quantity)}
            //  console.log(updateditem);
            this.updatedQuantities.push(updateditem);
          }
        }
      }
      }

  
  
      
     this.itemAddservice.updateoriginalQuantities(this.updatedQuantities)
       console.log(this.updatedQuantities)
 
   this.updatedQuantities=[];

    this.clearvoucart();
  }
  clearvoucart(){
    this.itemAddservice.clearvouchercart();
    this.cartitemArray=[];
  }

  test(){
      this.uiservice.showSnackbar("glassware updated",null,3000);
//  this.snackBar.open("testing ",null,{
//    duration:2000,
//  });
    //  console.log(this.cartitemArray);


  }

}
