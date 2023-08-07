import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseStorageService } from '../../firebase-storage.service';
import { Observable, Subscription } from 'rxjs';

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

  constructor(private firebaseStorageService: FirebaseStorageService) {}

  ngOnInit(): void {
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
    this.files.push(file)
    this.isUploading = true
    const filePath = 'uploads/' + crypto.randomUUID() + file.name
    this.$uploadProgress = this.firebaseStorageService.uploadFile(file, filePath)
  }

  formatBytes(bytes: number): string {
    if(bytes === 0) {
      return '0 bytes'
    }

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    // return the file size to at least 2 decimals
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe()
  }
}
