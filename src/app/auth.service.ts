import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private auth: AngularFireAuth
  ) { }

  recoverPassword(email: string): Observable<void> {
    return from(this.auth.sendPasswordResetEmail(email))
  }

  login(params: SignIn): Observable<any> {
    return from(
      this.auth.signInWithEmailAndPassword(
        params.email, params.password
      )
    )
  }
}

type SignIn = {
  email: string,
  password: string
}
