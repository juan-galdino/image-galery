import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseStorageService } from '../../firebase-storage.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/auth.service';
import firebase from 'firebase/compat';
import { Router } from '@angular/router';

type FileUpload = { file: File, progress: number | undefined, message?: string | undefined, id: string };

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.css']
})
export class UploadImagesComponent implements OnInit, OnDestroy {
  progress: number | undefined
  isUploading = false
  isUploadComplete = false
  completeUploadSubscription!: Subscription
  uploadStatusSub!: Subscription
  fileUploads: FileUpload[] = []
  loggedUser!: firebase.User | null
  uploadSub: Subscription | undefined
  userSubscription!: Subscription | null

  constructor(
    private authService: AuthenticationService,
    private firebaseStorageService: FirebaseStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe(user => user ? this.loggedUser = user : null)

    this.completeUploadSubscription = this.firebaseStorageService.uploadCompleteSubject.subscribe(value => {
      this.isUploadComplete = value
    })

    this.uploadStatusSub = this.firebaseStorageService.uploadStatus.subscribe(uploadId => {
      const upload = this.fileUploads.find(upload => upload.id === uploadId)

      if (upload) {
        upload.message = "Envio completo!"
      }
    })
  }

  onFilesDropped(files: FileList): void {
    this.uploadFiles(files)
  }

  onFilesSelected(event: any): void {
    const files = event.target.files
    if (!files) return
    this.uploadFiles(files)
  }

  uploadFiles(files: FileList): void {
    if (!this.loggedUser) return

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      if (!file) continue

      const filePath = `users/${this.loggedUser.uid}/uploads/${file.name}`
      const uploadId = window.crypto.randomUUID()
      const newUpload: FileUpload = { file: file, progress: undefined, id: uploadId }

      this.fileUploads.push(newUpload)
      this.isUploading = true

      this.uploadSub = this.firebaseStorageService.uploadFile(newUpload.file, filePath, uploadId).subscribe(
        (percentage) => {
          newUpload.progress = percentage
          newUpload.message = "Enviando..."
        },
        (error: any) => {
          console.error(error)
        }
      )
    }
  }

  formatBytes(bytes: number): string {
    return this.firebaseStorageService.formatImageSize(bytes)
  }

  goToGallery(): void {
    this.router.navigate(['/galeria'])
  }

  ngOnDestroy(): void {
    this.uploadSub?.unsubscribe()
    this.uploadStatusSub.unsubscribe()
    this.isUploadComplete = false
    this.completeUploadSubscription.unsubscribe()
    this.userSubscription?.unsubscribe()
  }
}
