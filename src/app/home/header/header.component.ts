import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from 'src/app/auth/auth.service'
import { Subscription, catchError, from, map, of } from 'rxjs'
import firebase from 'firebase/compat'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage'
import { AngularFireStorage } from '@angular/fire/compat/storage'

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
    private changeDetectorRef: ChangeDetectorRef,
    private storage: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authenticationService.user$.subscribe(
      (user) => {
        if (user) {
          this.loggedUser = user
          this.userPhotoURL = user.photoURL
          this.userName = user.displayName
          this.userEmail = user.email
        }
      }
    )
  }

  onPhotoSelected(event: any) {
    if (!event.target.files) return
    this.updateProfilePhoto(event.target.files[0])
  }

  updateProfilePhoto(file: File) {
    if (!this.loggedUser) return

    this.isLoading = true

    const storage = getStorage()
    const newProfilePhotoPath = `users/${this.loggedUser.uid}/profile-photo/${file.name}`
    const storageRef = ref(storage, newProfilePhotoPath)

    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      () => { },
      (error) => {
        console.error('Erro ao subir nova imagem de perfil: ', error)
        this.isLoading = false
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          this.isLoading = false
          this.userPhotoURL = downloadUrl
          this.changeDetectorRef.detectChanges()

          this.updateUserPhotoUrl(downloadUrl)
          this.deletePreviousProfilePhoto(newProfilePhotoPath)
        })
      }
    )
  }

  updateUserPhotoUrl(url: string) {
    if (!this.loggedUser) return

    this.loggedUser
      .updateProfile({ photoURL: url })
      .then(() => { })
      .catch((err) => console.error(err))
  }

  deletePreviousProfilePhoto(newPhotoPath: string) {
    if (!this.loggedUser) return

    const path = `users/${this.loggedUser.uid}/profile-photo`

    this.storage
      .ref(path)
      .list()
      .pipe(
        map((listResult) => {
          const deletePromises: Promise<void>[] = []

          if (listResult.items.length > 1) {
            listResult.items.forEach((itemRef) => {
              if (itemRef.fullPath !== newPhotoPath)
                deletePromises.push(itemRef.delete())
            })

            return from(Promise.all(deletePromises))
          } else {
            return of({})
          }
        }),
        catchError((err) => {
          console.error('Erro ao listar as fotos', err)
          throw err
        })
      )
      .subscribe(
        () => { },
        (err) => console.error(err)
      )
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
