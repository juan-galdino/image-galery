import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  constructor(private storage: AngularFireStorage) { }

  uploadFile(file: File, path: string): Promise<string> {
    const fileRef = this.storage.ref(path)
    const task = fileRef.put(file)

    return new Promise((resolve, reject) => {
      task.then(() => {
        fileRef.getDownloadURL().subscribe( (url: string )=> {
          resolve(url)
        })
      })
      .catch(error => {
        reject(error)
      })
    })
  }
}