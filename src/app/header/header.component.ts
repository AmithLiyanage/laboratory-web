import { Component, OnInit,NgZone, OnDestroy } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import { ItemAdditionService } from '../services/item-addition.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  public IsSignedIn=false;
  authSubscription:Subscription;
  addcartitemcount:number;

  constructor(public authService: AuthService,private route : ActivatedRoute,private addItemservice:ItemAdditionService) { 
  
  }

 async ngOnInit() {
   this.authSubscription=this.authService.authChange.subscribe(authstatus => {
     this.IsSignedIn=authstatus;
     
   })
   let cart$=await this.addItemservice.getvoucher()
   cart$.valueChanges().subscribe(cart=>{
    const newObj: any = cart;
    // console.log(newObj.items)
     this.addcartitemcount=0;
   for(let itemid in newObj.items){
    this.addcartitemcount+=1;
   }
   });

  }

  ngOnDestroy(){
    this.authSubscription.unsubscribe();
  }

}
