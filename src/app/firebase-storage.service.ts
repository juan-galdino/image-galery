import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, Subject, catchError, finalize, forkJoin, from, map, mergeMap, of, tap, throwError } from 'rxjs';
import { ImageProps } from './shared/image-props.model';
import firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  images: ImageProps[] = []
  isListResultEmpty = false
  private hasNewImage = false
  private _isGaleryMode = true
  uploadStatus = new Subject<string>()
  uploadCompleteSubject = new Subject<boolean>()
  isImagesArrayEmpty = new Subject<boolean>()
  private _isLoaddingSub = new Subject<boolean>()

  constructor(private storage: AngularFireStorage) { }

  uploadProfilePhoto(file: File, newPath: string): Observable<number | undefined> {
    const newPhotoRef = this.storage.ref(newPath)

    const task = newPhotoRef.put(file)

    return task.percentageChanges().pipe(
        catchError(err => {
          console.error("Erro ao enviar nova foto de perfil ", err)
          throw err
        })
      ) 
  }

  getNewProfilePhotoUrl( newPath: string): Observable<string> {
    const newPhotoRef = this.storage.ref(newPath)
    return newPhotoRef.getDownloadURL()
  }

 deletePreviousProfilePhoto(user: firebase.User | null, newPhotoPath: string): Observable<any> {
  const path = 'users/' + user!.uid + '/profile-photo'
  
  return this.storage.ref(path).list().pipe( 
    map(listResult => {
    
    const deletePromises: Promise<void>[] = []

    listResult.items.forEach(itemRef => {
      if(itemRef.fullPath !== newPhotoPath) {
        deletePromises.push(itemRef.delete())
      }
    })

    if(deletePromises.length > 0) {
      return from(Promise.all(deletePromises)).pipe(
        catchError(err => {
          console.error('Erro ao deletar a foto de perfil anterior.')
          throw err
        }) 
      )
    } else return of({})
    
  }),
  catchError(err => {
    console.error('Erro ao listar todas as fotos', err)
    throw err
  })
  )
      
  }

  uploadFile(file: File, path: string, uploadId: string): Observable<number | undefined> {
    const fileRef = this.storage.ref(path)
    const task = fileRef.put(file)

    return new Observable<number | undefined>(observer => {
      task.percentageChanges().pipe(
        tap((percentage) => observer.next(percentage)),
        catchError(error => {
          observer.error(error);
          return throwError(error);
        }),
        finalize(() => {
          this.uploadStatus.next(uploadId)
          this.uploadCompleteSubject.next(true)
          this.hasNewImage = true
          this.isListResultEmpty = false
          this.isImagesArrayEmpty.next(false)
        })
        ).subscribe()
    })
  }

  getViewMode(): Observable<boolean> {
    return of(this._isGaleryMode)
  }

  setViewMode(value: boolean) {
    this._isGaleryMode = value
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
              const date = image.metadata.timeCreated
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
            this.isImagesArrayEmpty.next(false)
            this.isListResultEmpty = false
            this.images = this.sortByLatest(allImages)
            return this.images
          })      
        )
      }),
      
      catchError(error => {
        console.error(error)
        return of([])
      })
    )
  }

  removeFile(path: string): Observable<any> {
    const fileRef = this.storage.ref(path)
    return fileRef.delete()
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

  sortByLatest( images: ImageProps[] ): ImageProps[] {
    const sortedImages = images.sort((a: ImageProps, b: ImageProps) => {
      const timeA = new Date(a.timeCreated).getTime()
      const timeB = new Date(b.timeCreated).getTime()

      return timeB - timeA
    })

    return sortedImages
  }

}