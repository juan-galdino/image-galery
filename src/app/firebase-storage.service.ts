import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, Subject, finalize, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  private imagesUrls: string[] = []
  private hasNewImage = false
  messageSubject = new Subject<string>()

  constructor(private storage: AngularFireStorage) { }

  uploadFile(file: File, path: string): Observable<number | undefined> {
    const fileRef = this.storage.ref(path)
    const task = fileRef.put(file)

    return task.percentageChanges().pipe(
      tap( () => {
        this.messageSubject.next('')
      }),
      finalize( () => {
        this.hasNewImage = true
        this.messageSubject.next('Envio concluído!')
      })
    )
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