import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseStorageService } from '../firebase-storage.service';
import { Observable, Subscription } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.css']
})
export class UploadImagesComponent implements OnInit, OnDestroy {
  selectedFile: File | null = null
  $uploadProgress!: Observable<number | undefined>
  isUploading = false
  message!: string
  messageSubscription!: Subscription

  constructor(private storage: AngularFireStorage, private firebaseStorageService: FirebaseStorageService) {}

  ngOnInit(): void {
    this.messageSubscription = this.firebaseStorageService.messageSubject.subscribe(value => {
      this.message = value
    })  
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]
  }

  onUploadFile() {
    if(this.selectedFile) {
      this.isUploading = true
      const filePath = 'uploads/' + crypto.randomUUID() + this.selectedFile.name
      this.$uploadProgress = this.firebaseStorageService.uploadFile(this.selectedFile, filePath)
    }
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe()
  }
}
