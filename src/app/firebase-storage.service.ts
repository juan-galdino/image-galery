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
              const fullName = image.metadata.name
              const size = this.formatImageSize(image.metadata.size)
              const date = this.formatDate(image.metadata.timeCreated)
              const url = image.url

              return new ImageProps(
                fullName,
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
    const timeMs = new Date(timeCreated).getTime() 

    const lastUploadInSecs = Math.round((timeMs - Date.now()) / 1000)

    // Array representing one minute, hour, day, week, month, etc in seconds
    const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity]

    // Array is same as above but in string representation of the units.
    const units: Intl.RelativeTimeFormatUnit[] = ["second", "minute", "hour", "day", "week", "month", "year"]
  
    const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(lastUploadInSecs))

    // Get divisor to divide from the seconds. E.g if unit is "day", the divisor will be one day in seconds.
    const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

    const rtf = new Intl.RelativeTimeFormat('pt', { numeric: 'auto' })
    return rtf.format(Math.floor(lastUploadInSecs / divisor ), units[unitIndex])
  }

}