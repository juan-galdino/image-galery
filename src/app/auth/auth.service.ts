import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Observable, from, shareReplay } from 'rxjs';
import firebase from 'firebase/compat';
import { FirebaseStorageService } from '../firebase-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user$: Observable<firebase.User | null>

  private isAuthenticated$: Observable<boolean>

  constructor(
    private auth: AngularFireAuth,
    private firebaseStorageService: FirebaseStorageService
  ) {
    this.user$ = this.auth.authState

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

  login(params: UserSignature): Observable<any> {
    return from(
      this.auth.signInWithEmailAndPassword(
        params.email, params.password
      )
    )
  }

  signup(params: UserSignature): Observable<any> {
    return from(
      this.auth.createUserWithEmailAndPassword(
        params.email, params.password
      )
    )
  }

  logout(): void {
    this.firebaseStorageService.images = []
    this.auth.signOut()
  }
}

type UserSignature = {
  email: string,
  password: string
}
