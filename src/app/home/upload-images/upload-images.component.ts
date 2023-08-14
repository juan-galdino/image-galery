import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseStorageService } from '../../firebase-storage.service';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/auth.service';
import firebase from 'firebase/compat';

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.css']
})
export class UploadImagesComponent implements OnInit, OnDestroy {
  $uploadProgress!: Observable<number | undefined>
  isUploading = false
  message!: string
  messageSubscription!: Subscription
  files: any[] = []
  loggedUser!: firebase.User | null
  userSubscription!: Subscription | null

  constructor(
    private authService: AuthenticationService,
    private firebaseStorageService: FirebaseStorageService
  ) {}

  ngOnInit(): void {
     this.userSubscription = this.authService.user$.subscribe(user => {
      if(user) {
        this.loggedUser = user
      }
    })

    this.messageSubscription = this.firebaseStorageService.messageSubject.subscribe(value => {
      this.message = value
    })  
  }

  onFileDropped(file: File) {
    this.uploadFile(file)
  }

  onFileSelected(event: any) {
    if(event.target.files) {
      this.uploadFile(event.target.files[0])
    }
  }

  uploadFile(file: File) {
    if(this.loggedUser) {
      this.files.push(file)
      this.isUploading = true
      const filePath = 'users/'+ this.loggedUser.uid +'/uploads/' + file.name
      this.$uploadProgress = this.firebaseStorageService.uploadFile(file, filePath)
    }
  }

  formatBytes(bytes: number): string {
    return this.firebaseStorageService.formatImageSize(bytes)
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe()
    this.userSubscription?.unsubscribe()
  }
}
