import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user = false
  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    // fake temporary guard
    if(!this.user) {
      this.router.navigate(["login"])
    }
    
    // fake temporary authenticating
     this.loginService.getUser().subscribe(value => {
      this.user = value
     })
  }
}