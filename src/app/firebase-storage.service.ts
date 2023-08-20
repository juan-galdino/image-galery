import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, Subject, catchError, finalize, forkJoin, from, map, mergeMap, of, tap } from 'rxjs';
import { ImageProps } from './shared/image-props.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  images: ImageProps[] = []
  isListResultEmpty = false
  private hasNewImage = false
  
  messageSubject = new Subject<string>()
  isImagesArrayEmpty = new Subject<boolean>()
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
        this.isListResultEmpty = false
        this.isImagesArrayEmpty.next(false)
        this.messageSubject.next('Envio concluído!')
      })
    )
  }

  getImagesUrls(userId: string): Observable<ImageProps[]> {
    if(this.images.length !== 0 && !this.hasNewImage) {
      return of(this.images)
    }

    if(this.isListResultEmpty) {
      this.isImagesArrayEmpty.next(true) 
      return of([])
    }

    return this.storage.ref('users/'+ userId + '/uploads').list().pipe(
      mergeMap(listResult => {
        
        // need to know if user doesn't have any images storaged
        if(listResult.items.length === 0) {
          this.isListResultEmpty = true 
          this.isImagesArrayEmpty.next(true)
          return of([])
        }

        this._isLoaddingSub.next(true)

        const arrayOfObservables$ = listResult.items.map(itemRef => {
          return from(Promise.all([              // the result both promises in an array for each item.
            itemRef.getMetadata(),
            itemRef.getDownloadURL()
          ])).pipe(
            map(([metadata, url]) => {
              return { metadata, url }          // return itemRef as an object
            })
          )
        })

        return forkJoin(arrayOfObservables$).pipe(     // takes an array of observables and transforms into one
          map(arrayOfImagesWithMetadata => {    
            const allImages: ImageProps[] = arrayOfImagesWithMetadata.map(image => {
              const name = image.metadata.name
              const shortName = this.getShortName(name)
              const size = this.formatImageSize(image.metadata.size)
              const date = this.formatDate(image.metadata.timeCreated)
              const url = image.url

              return new ImageProps(
                name,
                shortName,
                size,
                date,
                url
              )
            })

            this.hasNewImage = false
            this._isLoaddingSub.next(false)
            this.isListResultEmpty = false
            this.images = allImages
            return this.images
          })      
        )
      }),
      
      catchError(error => {
        console.log(error)
        return of([])
      })
    )
  }

  get isImagesArrayEmpty$() {
    return this.isImagesArrayEmpty.asObservable()
  }

  get isLoadding$() {
    return this._isLoaddingSub.asObservable()
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

  getShortName(name: string): string {
    return name.length > 8 ? name.substring(0, 10) + "..." : name
  }
}