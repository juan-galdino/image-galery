import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  private imagesUrls: string[] = []
  private hasNewImage = false

  constructor(private storage: AngularFireStorage) { }

  uploadFile(file: File, path: string): Promise<string> {
    const fileRef = this.storage.ref(path)
    const task = fileRef.put(file)

    return new Promise((resolve, reject) => {
      task.then(() => {
        fileRef.getDownloadURL().subscribe( (url: string )=> {
          this.hasNewImage = true
          resolve(url)
        })
      })
      .catch(error => {
        reject(error)
      })
    })
  }

  getImagesUrls() {
    if(this.imagesUrls.length !== 0 && !this.hasNewImage) {
      return of(this.imagesUrls)
    }
    return this.storage.ref('uploads/').listAll().pipe(
      map(res => {
        const urls: string[] = []
        res.items.forEach(itemRef => {
          itemRef.getDownloadURL().then(url => urls.push(url))
        })
        this.hasNewImage = false
        this.imagesUrls = urls
        return urls
      }),
    )
  }
}