import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ItemRemovalService } from 'src/app/services/item-removal.service';

@Component({
  selector: 'app-remhistory',
  templateUrl: './remhistory.component.html',
  styleUrls: ['./remhistory.component.css']
})
export class RemhistoryComponent implements OnInit {

  listData: MatTableDataSource<any>;
  vouchersarray: any[] = [];
  datasourcelist: any[] = [];
  searchKey: string;

  @ViewChild(MatSort) sort1: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private itemRemservice: ItemRemovalService) {

  }

  ngOnInit() {
    this.itemRemservice.getRemvouchers().subscribe(item => {
      // console.log(item.length);
      const newObj: any = item;
      console.log(newObj)
      for (let i = 0; i < newObj.length; i++) {
        for (let j = 0; j < newObj[i].items.length; j++) {
          let array = {
            VoucherId: newObj[i].Voucher_Id,
            Reason: newObj[i].Reason,
            Date_Removed: newObj[i].Date_Removed,
            Item_name: newObj[i].items[j].item_name,
            category: newObj[i].items[j].category,
            measurement: newObj[i].items[j].measurement,
            Quantity: newObj[i].items[j].Quantity
          }
          this.datasourcelist.push(array)

        }
        // console.log(this.datasourcelist);
        this.listData = new MatTableDataSource(this.datasourcelist);
        this.listData.sort = this.sort1;
        this.listData.paginator = this.paginator;
        // let obj={category_name: newObj.items[item].category_name,Quantity: newObj.items[item].Quantity}
        // this.cartitemArray.push(obj);
      }
    })
  }
  displayedColumns: string[] = ['VoucherId', 'Date_Removed', 'Reason', 'category', 'Item_name', 'Quantity'];

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

}
