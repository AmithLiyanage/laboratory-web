import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  email="";
  password="";

  constructor( public authService: AuthService) { }

  ngOnInit() {
  }

  SubmitSignUp(){
    this.authService.SignUp(this.email,this.password);
    console.log(this.email,this.password);
  }

}
