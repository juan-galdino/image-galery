import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  accountEmail!: string
  actionCode!: string
  isActionCodeChecked = false 
  isConfirming = false
  isPasswordConfirmed = false
  mode!: string
  form!: FormGroup
  hide = true

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
      this.activatedRoute.queryParams.subscribe(params => {
        this.mode = params['mode']
        this.actionCode = params['oobCode']

        switch (this.mode) {
          case 'resetPassword': {
            this.checkResetPasswordCode(this.authService.getAuth(), this.actionCode)
            break
          }
          case 'recoverEmail': {
            this.handleRecoverEmail(this.authService.getAuth(), this.actionCode)
            break
          }
          case 'verifyEmail': {
            this.handleVerifyEmail(this.authService.getAuth(), this.actionCode)
            break
          }
          default: {
            this.router.navigate(['/login']);
          }
        }

      })

      this.form = this.formBuilder.group({
        password: ['', [Validators.required]]
      })
    }

    checkResetPasswordCode(auth: AngularFireAuth, actionCode: string) {
      auth.verifyPasswordResetCode(actionCode)
        .then(email => {
          this.isActionCodeChecked = true
          this.accountEmail = email
        }).catch(error => {
          alert('A ação do código é inválida. Isso pode acontecer se o código estiver errado, expirado, já tiver sido utilizado ou até mesmo sua conexão de internet apresenta problemas. Clique em "Ok" para retornar à página de Login.')
          this.router.navigate(['/login'])
        })
    }

    handleResetPassword() {
      this.isConfirming = true
      const newPassword = this.form.value.password
      
      this.authService.getAuth().confirmPasswordReset(this.actionCode, newPassword)
        .then(() => {
          this.isConfirming = false
          this.isPasswordConfirmed = true
        })
        .catch(error => {
          this.snackBar.open("Ocorreu um erro durante a confirmação. O código de acesso pode ter expirado ou você não está conectado à uma rede. Verifique sua conexão de internet ou tente novamente redefinir a senha na tela de Login.", "OK", {
            duration: 5000
          })
          this.isConfirming = false
        })
    }

    handleRecoverEmail(auth: AngularFireAuth, actionCode: string) {}

    handleVerifyEmail(auth: AngularFireAuth, actionCode: string) {}

    backToLogin() {
      this.router.navigate(['/login'])
    }
}
