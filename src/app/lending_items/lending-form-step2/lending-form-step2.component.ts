import { Component, OnInit, ViewChild,EventEmitter,Output} from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { ItemService } from 'src/app/services/glassware.service';
import { AvailableItemsService } from 'src/app/services/available-items.service';
import { LendingServiceService } from 'src/app/services/lending-service.service';
import { LendingquantitydialogComponent } from '../lendingquantitydialog/lendingquantitydialog.component';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'lending-form-step2',
  templateUrl: './lending-form-step2.component.html',
  styleUrls: ['./lending-form-step2.component.css']
})
export class LendingFormStep1Component implements OnInit {
  listDataGlass: MatTableDataSource<any>;
  tablearray: Array<any>;
  listDatachemicals: MatTableDataSource<any>;
  tablearraychemicals: Array<any>;
  glasssearchKey: string="";
  chemicalsearchKey: string="";
  lendingcart:any;
  quantity: number;
  @Output() QuantitySubmited=new EventEmitter();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginatorglass') paginatorglass: MatPaginator;
  @ViewChild('paginatorchem') paginatorchem: MatPaginator;

  constructor(private availableitemservice:AvailableItemsService,
              private lendingitemservice:LendingServiceService,
              private dialog: MatDialog,
              private uiservice:UiService) { }

  async ngOnInit() {
    this.availableitemservice.getavailableGlasswaresnap().subscribe(
      list => {
        let array = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          };
        });
        this.tablearray = array;

        this.listDataGlass = new MatTableDataSource(array);
        this.listDataGlass.sort = this.sort;
        this.listDataGlass.paginator = this.paginatorglass;
      }
    );

    this.availableitemservice.getavailablechemicalesnap().subscribe(
      list => {
        let array = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          };
        });
        this.tablearraychemicals = array;

        this.listDatachemicals = new MatTableDataSource(array);
        this.listDatachemicals.sort = this.sort;
        this.listDatachemicals.paginator = this.paginatorchem;
      }
    );

    (await this.lendingitemservice.getlendingcart()).valueChanges().subscribe(cart => {
      //  console.log(cart)
      this.lendingcart = cart;
    })
  }

  displayedColumns: string[] = ['item_name', 'AvailableQuantity','lendquantity'];

  //  Quantity dialog
  openDialog(item): void {

    const dialogRef = this.dialog.open(LendingquantitydialogComponent, {
      width: '250px',
      data: { Quantity: this.quantity }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.quantity = result;
 
        if (this.quantity <=item.Quantity) {
          this.lendingitemservice.Addtocartfromdialog(item, this.quantity)
        }
        else{
          this.uiservice.showSnackbar("Cant lend more than available",null,3000);
        }
        this.quantity = undefined;
        this.QuantitySubmited.emit();
      }
    )
      ;
  }

 // Getting the quantities from lending cart
 getQuantity($key) {
  // let k=$key;

  if (!this.lendingcart) return 0;
  if (!this.lendingcart.items) return 0;

  let item = this.lendingcart.items[$key]

  return item ? item.Quantity : 0;

}

getMeasurementUnitlend($key) {
  // let k=$key;

  if (!this.lendingcart) return 0;
  if (!this.lendingcart.items) return 0;

  let item = this.lendingcart.items[$key]

  return item ? item.measurement : 0;

}

  // New lendings
  addto(item) {
    console.log(item);
    this.lendingitemservice.Addtolendingcart(item);
    this.QuantitySubmited.emit();
  }

  subtractfromcart(item) {
    this.lendingitemservice.subfromlendingcart(item);
    this.QuantitySubmited.emit();
  }

  // glassware filtering
  applyFilterglass() {
     this.listDataGlass.filter = this.glasssearchKey.trim().toLowerCase();
  }
  onSearchClearglass(){
    this.glasssearchKey = "";
    this.applyFilterglass();
  }

  // Chemical filtering
  applyFilterchem() {
    this.listDatachemicals.filter = this.chemicalsearchKey.trim().toLowerCase();
 }
 onSearchClearchem(){
   this.chemicalsearchKey = "";
   this.applyFilterchem();
 }

}
