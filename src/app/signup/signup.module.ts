import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    SignupComponent
  ],
  imports: [
    CommonModule,
    SignupRoutingModule,
    ReactiveFormsModule,
    
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule
  ]
})
export class SignupModule { }
