import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, Subject, finalize, from, map, mergeMap, of, tap } from 'rxjs';
import { ImageProps } from './shared/image-props.model';
import firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  images: ImageProps[] = []
  private hasNewImage = false
  messageSubject = new Subject<string>()
  private _isLoaddingSub = new Subject<boolean>()

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

  getImagesUrls(userId: string): Observable<ImageProps[]> {
    if(this.images.length !== 0 && !this.hasNewImage) {
      return of(this.images)
    }

    this._isLoaddingSub.next(true)

    return this.storage.ref('users/'+ userId + '/uploads').list().pipe(
      map(res => {
        let allImages: ImageProps[] = []

        res.items.forEach(itemRef => {
          let imageMetaData: firebase.storage.FullMetadata

          // get data
          itemRef.getMetadata().then(res => {
            imageMetaData = res
          })
          
          // get url
          itemRef.getDownloadURL().then(url => {
            let imageData = new ImageProps(
              imageMetaData.name, 
              this.formatImageSize(imageMetaData.size), 
              this.formatDate(imageMetaData.timeCreated), 
              url
            )
            allImages.push(imageData)
          })
        })

        this.hasNewImage = false
        this._isLoaddingSub.next(false)
        this.images = allImages
        return this.images
      }),
      )
  }

  get isLoadding$() {
    return this._isLoaddingSub.asObservable()
  }

  formatImageName(fileName: string): string {
    return fileName.substring(36) // remove uuid characters
  }

  formatImageSize(bytes: number): string {
    if(bytes === 0) {
      return '0 bytes'
    }

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    // return the file size to at least 2 decimals
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  formatDate(timeCreated: string): string {
    const date = new Date(timeCreated)
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour:'numeric' ,
      minute:'numeric',
      second:'numeric'
    }
    return date.toLocaleDateString('pt-BR', options);
  }
}