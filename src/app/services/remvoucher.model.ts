import { item } from './item.model';

export interface remvoucher {
    Voucher_Id: string;
    Reason:string;
    Date_Removed:Date;
    items:item[];
  }