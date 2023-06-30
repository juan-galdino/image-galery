import { Component } from '@angular/core';
import { FirebaseStorageService } from '../firebase-storage.service';

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.css']
})
export class UploadImagesComponent {
  selectedFile: File | null = null

  constructor(private firebaseStorageService: FirebaseStorageService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]
  }

  onUploadFile() {
    if(this.selectedFile) {
      const filePath = 'uploads/' + this.selectedFile.name
      this.firebaseStorageService.uploadFile(this.selectedFile, filePath).then(
        url => console.log('Arquivo enviado com sucesso!', url )
      ).catch(
        error => console.error('Erro ao enviar arquivo:', error )
      )
    }
  }
}
