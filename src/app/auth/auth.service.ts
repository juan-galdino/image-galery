import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Observable, from, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private isAuthenticated$: Observable<boolean>

  constructor(
    private auth: AngularFireAuth
  ) {
    this.isAuthenticated$ = new Observable<boolean>(observer => {
      this.auth.onAuthStateChanged(user => {
        observer.next(!!user)
      })
    }).pipe(
      shareReplay(1)
    )
  }

  get isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$
  }

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
