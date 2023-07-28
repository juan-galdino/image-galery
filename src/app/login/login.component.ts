import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup
  isLoggingIn = false

  constructor(
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router
    ) {}
  
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  onLogin() {
    this.isLoggingIn = true
    
    this.loginService.login({
      email: this.form.value.email,
      password: this.form.value.password
    }).subscribe( () => {
      this.router.navigate(['gallery'])
    }, (error: any) => {
      this.isLoggingIn = false
      this.snackBar.open(error.message, 'OK', {
        duration: 5000
      })
    })
    
  }
  
}
