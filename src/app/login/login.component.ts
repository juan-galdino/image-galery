import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/auth.service'; 
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup
  isLoggingIn = false
  isRecoveringPassword = false

  constructor(
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
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
    
    this.authenticationService.login({
      email: this.form.value.email,
      password: this.form.value.password
    }).subscribe( (data) => {
      console.log(data)
      this.router.navigate(['gallery'])
    }, (error: any) => {
      this.isLoggingIn = false
      this.snackBar.open(error.message, 'OK', {
        duration: 5000
      })
    })
  }
  
  recoverPassword() {
    this.isRecoveringPassword = true

    this.authenticationService.recoverPassword(this.form.value.email)
    .subscribe(() => {
      this.isRecoveringPassword = false
      this.snackBar.open('Você pode recuperar sua senha no seu e-mail cadastrado. Cheque a sua caixa de entrada.', 'OK', {
        duration: 5000
      })
    }, (error: any) => {
      this.isRecoveringPassword = false
      this.snackBar.open(error.message, 'OK', {
        duration: 5000
      })
    })
  }
  
}
