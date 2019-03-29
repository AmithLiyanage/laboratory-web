import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import {Subscription} from 'rxjs';
import { ItemRemovalService } from '../services/item-removal.service';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavComponent implements OnInit,OnDestroy {
  navisAuth:boolean;
  authSubcription:Subscription;
  remcartitemcount:number;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );


  constructor(private breakpointObserver: BreakpointObserver,private authservice:AuthService,private itemremservice:ItemRemovalService) {

  }

  async ngOnInit(){
    this.authSubcription=this.authservice.authChange.subscribe(status => {
      this.navisAuth=status;
      console.log(status)
    })

    let cart$=await this.itemremservice.getRemovecart()
    cart$.subscribe(cart=>{
     const newObj: any = cart;
     // console.log(newObj.items)
      this.remcartitemcount=0;
    for(let itemid in newObj.items){
     this.remcartitemcount+=1;
    }
    });
  }

  ngOnDestroy(){
    this.authSubcription.unsubscribe();
  }

}

//expand list
export class ExpansionOverviewExample {
  panelOpenState = false;
}
