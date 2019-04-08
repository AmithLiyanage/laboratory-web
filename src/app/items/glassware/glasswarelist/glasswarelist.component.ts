import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';

import { ItemService } from 'src/app/services/glassware.service';
import { MatTableDataSource, } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material'
import { NewglasswareComponent } from '../newglassware/newglassware.component';
import { ItemAdditionService } from '../../../services/item-addition.service';
import { Subscription } from 'rxjs';
import { item } from 'src/app/services/item.model';
import { QuantitydialogComponent } from '../quantitydialog/quantitydialog.component';
import { ItemRemovalService } from 'src/app/services/item-removal.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-glasswarelist',
  templateUrl: './glasswarelist.component.html',
  styleUrls: ['./glasswarelist.component.css']
})
export class GlasswarelistComponent implements OnInit, OnDestroy {
  @Input() newAdditions: any;
  @Input('item') items: item;
  Additemsub: Subscription;
  Removeitemsub: Subscription;
  tablearray: Array<any>;
  addcart: any;
  removecart: any;
  quantity: number;
  searchKey: string;
  listData: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private service: ItemService,
    private dialog: MatDialog,
    private ItemAddService: ItemAdditionService,
    private itemRemovalService: ItemRemovalService,
    private uiservice: UiService) {

  }


  displayedColumns: string[] = ['item_name', 'Quantity', 'Addition', 'Removal', 'actions'];





  //  Quantity dialog
  openDialog(glassware, pos): void {
    const dialogRef = this.dialog.open(QuantitydialogComponent, {
      width: '250px',
      data: { Quantity: this.quantity }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.quantity = result;
      if (pos == 'add') {
        if (this.quantity) {
          this.ItemAddService.Addtocartfromdialog(glassware, this.quantity)

        }
        this.quantity = undefined;
      }
      else if (pos == 'remove') {
        if (this.quantity - glassware.Quantity > 0) {
          this.uiservice.showSnackbar("Invalid Quantity", null, 3000)
        }
        else if (this.quantity) {
          this.itemRemovalService.AddtoRemovecartfromdialog(glassware, this.quantity)
        }
        this.quantity = undefined;
      }
    }
    )
      ;
  }

  async ngOnInit() {
    this.service.getGlassware().subscribe(
      list => {
        let array = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          };
        });
        this.tablearray = array;
        // console.log(array)
        this.listData = new MatTableDataSource(array);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
      }


    );
    // getting the adding cart
    this.Additemsub = (await this.ItemAddService.getvoucher()).valueChanges().subscribe(cart => {
      //  console.log(cart)
      this.addcart = cart
    })

    console.log(this.addcart);

    this.Removeitemsub = (await this.itemRemovalService.getRemovecart()).subscribe(cart => {
      //  console.log(cart)
      this.removecart = cart
    })

  }



  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  OnCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    this.dialog.open(NewglasswareComponent, dialogConfig);
  }

  //Edit button 
  onEdit(row) {
    console.log(row);
    this.service.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    this.dialog.open(NewglasswareComponent, dialogConfig);
  }

  // Deletebutton
  onDelete($key, row) {

    if (confirm('Are you sure to delete this record ?')) {
      this.service.deleteGlassware($key, row)
    }
  }

  // New additions


  addto(glassware) {
    console.log(glassware);
    this.ItemAddService.Addtovoucher(glassware);
  }

  subtractfromcart(glassware) {
    this.ItemAddService.subfromvoucher(glassware);
  }

  onRemove($key, row) {
    if (confirm('Are you sure to reset this record ?')) {
      this.ItemAddService.removeitem($key, row)
      this.itemRemovalService.removeitem($key,row)
    }
  }


  //   addToRemovecart(glassware){
  //     console.log(glassware);
  //    this.itemRemovalService.AddtoRemovecart(glassware);
  //  }
  // Get addedQuantity
  getQuantity($key) {
    if (!this.addcart) return 0;
    if (!this.addcart.items) return 0;
    let item = this.addcart.items[$key]
    return item ? item.Quantity : 0;
  }

  getremovecartQuantity($key) {


    if (!this.removecart) return 0;
    if (!this.removecart.items) return 0;

    let item = this.removecart.items[$key]

    return item ? item.Quantity : 0;

  }

  ngOnDestroy() {
    this.Additemsub.unsubscribe();
    this.Removeitemsub.unsubscribe();
  }

  addtoRemovecart(item) {
    this.itemRemovalService.addtoRemovecart(item);

  }

  // subtracting items from cart
  subtractfromRemovecart(item) {
    this.itemRemovalService.subfromRemovecart(item);


  }
}
