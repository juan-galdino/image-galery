import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form!: FormGroup
  isUserBeingCreated = false

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  onSignup() {
    this.isUserBeingCreated = true

    this.authService.signup({
      name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password
    }).subscribe(() => {
      this.router.navigate(['home/galeria'])
    }, (error: any) => {
      this.isUserBeingCreated = false
      this.snackBar.open(error.message, 'OK', {
        duration: 5000
      })
    })
  }

  goToLoginPage() {
    this.router.navigate(['login'])
  }

  goToHomePage() {
    this.router.navigate([''])
  }
}
