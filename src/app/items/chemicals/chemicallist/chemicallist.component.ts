import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogConfig, MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { NewchemicalsdialogComponent } from '../newchemicalsdialog/newchemicalsdialog.component';
import { ChemicalsService } from 'src/app/services/chemicals.service';
import { ItemAdditionService } from 'src/app/services/item-addition.service';
import { Subscription } from 'rxjs';
import { ItemRemovalService } from 'src/app/services/item-removal.service';
import { ChemicalquantitydialogComponent } from '../chemicalquantitydialog/chemicalquantitydialog.component';

@Component({
  selector: 'app-chemicallist',
  templateUrl: './chemicallist.component.html',
  styleUrls: ['./chemicallist.component.css']
})
export class ChemicallistComponent implements OnInit, OnDestroy {

  tablearray: Array<any>;
  listData: MatTableDataSource<any>;
  addcart: any;
  Additemsub: Subscription;
  Removeitemsub: Subscription;
  removecart: any;
  quantity: number;
  searchKey: string;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private chemservice: ChemicalsService,
    private dialog: MatDialog,
    private ItemAddService: ItemAdditionService,
    private ItemRemovalService: ItemRemovalService) { }


  displayedColumns: string[] = ['item_name', 'Quantity', 'Addition', 'Removal', 'actions'];

  async ngOnInit() {
    this.chemservice.getChemical().subscribe(
      list => {
        let array = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          };
        });
        this.tablearray = array;

        this.listData = new MatTableDataSource(array);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
      }
    )
// add item cart
    this.Additemsub = (await this.ItemAddService.getvoucher()).valueChanges().subscribe(cart => {
      //  console.log(cart)
      this.addcart = cart
    })
// remove item cart
    this.Removeitemsub = (await this.ItemRemovalService.getRemovecart()).subscribe(cart => {
      //  console.log(cart)
      this.removecart = cart
    })


  }


  //  Quantity dialog
  openDialog(chemical, pos): void {
    console.log(chemical);
    const dialogRef = this.dialog.open(ChemicalquantitydialogComponent, {
      width: '250px',
      data: { Quantity: this.quantity }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(pos);
      this.quantity = result;
      if (pos == 'add') {
        if (this.quantity) {
          this.ItemAddService.Addtocartfromdialog(chemical, this.quantity)
        }
        this.quantity = undefined;
      }
      else if (pos == 'remove') {
        if (this.quantity - chemical.Quantity > 0) {
          return console.log("invalid quantity")
        }
        else if (this.quantity) {
          this.ItemRemovalService.AddtoRemovecartfromdialog(chemical, this.quantity)
        }
        this.quantity = undefined;
      }
    }
    )
      ;
  }
  // Create new button
  OnCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    this.dialog.open(NewchemicalsdialogComponent, dialogConfig);
  }
  // Edit button pressed
  onEdit(row) {
    console.log(row);
    this.chemservice.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    this.dialog.open(NewchemicalsdialogComponent, dialogConfig);
  }


  // Deletebutton
  onDelete($key, chemical) {
    if (confirm('Are you sure to delete this record ?')) {
      this.chemservice.deleteChemical($key, chemical)
    }
  }
  // Getting the quantities from add cart
  getQuantity($key) {
    // let k=$key;

    if (!this.addcart) return 0;
    if (!this.addcart.items) return 0;

    let item = this.addcart.items[$key]

    return item ? item.Quantity : 0;

  }

  // Getting quantities to remove cart
  getremovecartQuantity($key) {
    // let k=$key;

    if (!this.removecart) return 0;
    if (!this.removecart.items) return 0;

    let item = this.removecart.items[$key]

    return item ? item.Quantity : 0;

  }

  getMeasurementUnitadd($key) {
    // let k=$key;

    if (!this.addcart) return 0;
    if (!this.addcart.items) return 0;

    let item = this.addcart.items[$key]
    console.log(item)
    return item ? item.measurement : 0;

  }

  getMeasurementUnitrem($key) {
    // let k=$key;

    if (!this.removecart) return 0;
    if (!this.removecart.items) return 0;

    let item = this.removecart.items[$key]
    console.log(item)
    return item ? item.measurement : 0;

  }

  // Searching
  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }
  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  addtoRemovecart(item) {
    this.ItemRemovalService.addtoRemovecart(item);

  }

  // New additions
  addto(glassware) {
    console.log(glassware);
    this.ItemAddService.Addtovoucher(glassware);
  }

  subtractfromcart(glassware) {
    this.ItemAddService.subfromvoucher(glassware);
  }


  // add remove items from remove cart
  subtractfromRemovecart(item) {
    this.ItemRemovalService.subfromRemovecart(item);
  }

  onRemove($key, row) {
    if (confirm('Are you sure to reset this record ?')) {
      this.ItemAddService.removeitem($key, row)
      this.ItemRemovalService.removeitem($key,row)
    }
  }


  ngOnDestroy() {
    this.Additemsub.unsubscribe();
    this.Removeitemsub.unsubscribe();
  }
}
