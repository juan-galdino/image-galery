import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Observable, catchError, from, shareReplay, switchMap } from 'rxjs';
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

  getAuth(): AngularFireAuth {
    return this.auth
  }

  get isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$
  }

  recoverPassword(email: string): Observable<void> {
    return from(this.auth.sendPasswordResetEmail(email, {url: "https://image-galery-ng.web.app/login"}))
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
    ).pipe(
      switchMap(userCredential => {
        const user = userCredential.user
        
        return from(user!.updateProfile({
          displayName: params.name
        }))

      }),
      catchError((error: any) => {
        throw error
      })
    )
  }

  logout(): void {
    this.firebaseStorageService.images = []
    this.firebaseStorageService.isImagesArrayEmpty.next(false)
    this.firebaseStorageService.isListResultEmpty = false
    this.auth.signOut()
  }
}

type UserSignature = {
  name?: string,
  email: string,
  password: string
}
