import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Observable, Subject, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // temporary service

  private user = new Subject<boolean>()
  _signInResponse = new Subject()

  constructor(
    private auth: AngularFireAuth
  ) { }

  login(params: SignIn): Observable<any> {
    return from(
      this.auth.signInWithEmailAndPassword(
        params.email, params.password
      )
    )
  }

  getUser() {
    return this.user.asObservable()
  }

  setUser(value: boolean) {
    this.user.next(value)
  }
}

type SignIn = {
  email: string,
  password: string
}
