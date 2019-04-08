import { Component, OnInit, OnDestroy } from '@angular/core';
import {NgForm} from '@angular/forms'
import { AuthService } from "../../services/auth.service";
import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit,OnDestroy {
  username='';
  password='';
  isLoading=false;
  private loadingsubs:Subscription;

  constructor(public authService: AuthService,
    private uiservice:UiService) { }

  ngOnInit() {
    this.loadingsubs=this.uiservice.loadingStateChanged.subscribe(isloading =>{
      this.isLoading=isloading
    })
  }

  onSubmit(){
    this.authService.SignIn(this.username,this.password)
  }

  ngOnDestroy(){
    this.loadingsubs.unsubscribe();
  }

}
