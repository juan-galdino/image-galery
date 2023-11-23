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
    private authService: AuthenticationService,
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
    
    this.authService.login({
      email: this.form.value.email,
      password: this.form.value.password
    }).subscribe( (data) => {
      this.router.navigate(['home/galeria'])
    }, (error: any) => {
      this.isLoggingIn = false
      this.snackBar.open(error.message, 'OK', {
        duration: 5000
      })
    })
  }
  
  recoverPassword() {
    this.isRecoveringPassword = true

    this.authService.recoverPassword(this.form.value.email)
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

  goToSignupPage() {
    this.router.navigate(['/cadastro'])
  }

  goToHomePage() {
    this.router.navigate([''])
  }

  onSigninWithGoogle() {
    this.authService.signinWithGoogle().subscribe(() => {
      this.router.navigate(['home/galeria'])
    }, error => {
      console.error(error.message)
    })
  }
  
}
