import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ItemRemovalService } from 'src/app/services/item-removal.service';
import { QuantitydialogComponent } from '../glassware/quantitydialog/quantitydialog.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-removalcart',
  templateUrl: './removalcart.component.html',
  styleUrls: ['./removalcart.component.css']
})
export class RemovalcartComponent implements OnInit {
  cartitemArray:any[]=[];
  cartitemArrayWithoutkey:any[]=[];
  listData:MatTableDataSource<any>;
  originalglasswarequantities:any[]=[]
  originalchemicalquantities:any[]=[]
  updatedQuantities:any[]=[]
  dialogquantity:number;
  quantityvalidflag:boolean=true;

  constructor(private itemremovalservice:ItemRemovalService,private dialog:MatDialog) { }

 async ngOnInit() {
    let cart$=(await this.itemremovalservice.getRemovecart()).subscribe(item =>{
      const newObj: any = item;
      console.log(newObj);
          
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
           console.log(this.cartitemArrayWithoutkey);
           this.listData=new MatTableDataSource(this.cartitemArray);
          
    })
// Getting original qunatities
            this.itemremovalservice.getoriginalglasswarequantities().subscribe(item=>{
              this.originalglasswarequantities=item;

            })

            this.itemremovalservice.getoriginalchemicalquantities().subscribe(item=>{
              this.originalchemicalquantities=item;

            })
  }

  openDialog(glassware): void {
    const dialogRef = this.dialog.open(QuantitydialogComponent, {
      width: '250px',
      data: { Quantity: this.dialogquantity}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dialogquantity = result;
      if(this.dialogquantity){
      this.itemremovalservice.AddtoRemovecartfromdialog(glassware,this.dialogquantity)
      }
      this.dialogquantity=undefined;
      this.cartitemArray=[];
    });
  }


  displayedColumns: string[] = ['Category','Addition'];


  addtoRemovecart(item){
    this.itemremovalservice.addtoRemovecart(item);
    this.cartitemArray=[];
     }
    
    // subtracting items from cart
    subtractfromRemovecart(item){
    this.itemremovalservice.subfromRemovecart(item);
    this.cartitemArray=[];
    
    }

    onSubmit(form: NgForm){
      this.itemremovalservice.confirmaddition({
       Voucher_Id:form.value.voucherNo,
       Reason:form.value.Reason,
       Date_Removed:form.value.createdate.toDateString(),
       items:this.cartitemArrayWithoutkey,
         } );
   
         for(let i=0;i<this.cartitemArray.length;i++){
          console.log(this.cartitemArray[i].category);
          if(this.cartitemArray[i].category=="Glassware"){
          for(let j=0;j<this.originalglasswarequantities.length;j++){
            if(this.cartitemArray[i].item_name==this.originalglasswarequantities[j].item_name){
              let updateditem={$key:this.cartitemArray[i].$key,
                item_name:this.originalglasswarequantities[j].item_name,
                category:this.originalglasswarequantities[j].category,
                measurement:this.originalglasswarequantities[j].measurement,
                Quantity:(this.originalglasswarequantities[j].Quantity-this.cartitemArray[i].Quantity)}
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
                Quantity:(this.originalchemicalquantities[j].Quantity-this.cartitemArray[i].Quantity)}
              //  console.log(updateditem);
              this.updatedQuantities.push(updateditem);
            }
          }
        }
        }
   
     
     
        if(this.quantityvalidflag==true){
        this.itemremovalservice.updateoriginalQuantities(this.updatedQuantities)
        }
        else{
          console.log("invalid removal")
        }
         console.log(this.updatedQuantities)
    
     this.updatedQuantities=[];
   
      this.clearvoucart();
     }
     clearvoucart(){
       this.itemremovalservice.clearRemovecart();
       this.cartitemArray=[];
     }
   
}
