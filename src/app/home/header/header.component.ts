import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import firebase from 'firebase/compat';
import { FirebaseStorageService } from 'src/app/firebase-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  showSettingsBox = false
  loggedUser!: firebase.User | null
  isLoading = false
  userPhotoURL!: string | null
  userName!: string | null
  userEmail!: string | null
  userSubscription!: Subscription

  constructor(
    private router: Router, 
    private authenticationService: AuthenticationService,
    private firebaseStorageService: FirebaseStorageService,
    private snackBar: MatSnackBar 
    ) {}

  ngOnInit(): void {
    this.userSubscription = this.authenticationService.user$
      .subscribe( user => {
          if(user) {
            this.loggedUser = user
            this.userPhotoURL = user.photoURL
            this.userName = user.displayName            
            this.userEmail = user.email
          }
      })
  }

  onPhotoSelected(event: any) {
    if(event.target.files) {
      this.updateProfilePhoto(event.target.files[0])
    }
  }

  updateProfilePhoto(file: File) {
    this.isLoading = true

    if(this.loggedUser) {
      const newProfilePhotoPath = 'users/' + this.loggedUser.uid + '/profile-photo/' + file.name

      this.firebaseStorageService.uploadProfilePhoto(file, newProfilePhotoPath)
        .subscribe((value: number | undefined) => {
          if(this.loggedUser && value === 100) {
            this.firebaseStorageService.getNewProfilePhotoUrl(newProfilePhotoPath)
              .subscribe( (url: string) => {
                this.loggedUser?.updateProfile({photoURL: url})
                .then(() => {

                  this.isLoading = false
                  this.userPhotoURL = this.loggedUser!.photoURL
                  this.snackBar.open('Foto de perfil atualizada com sucesso!', 'OK', { duration: 5000 })
    
                  this.firebaseStorageService.deletePreviousProfilePhoto(this.loggedUser, newProfilePhotoPath).subscribe()
                  }
                )
                .catch(err => {
                  this.snackBar.open('Erro ao atualizar a foto.', 'OK', { duration: 5000 })
                  this.isLoading = false
                })
              }
            )
          }
        })  
    }

  }
  
  logout() {
    this.authenticationService.logout()
    this.router.navigate(['login'])
    this.showSettingsBox = false
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe()
  }

}
