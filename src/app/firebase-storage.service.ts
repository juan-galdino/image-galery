import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, Subject, catchError, finalize, forkJoin, from, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { ImageProps } from './shared/image-props.model';
import firebase from 'firebase/compat';
import { Reference } from '@angular/fire/compat/storage/interfaces';

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

  updateProfilePhoto(file: File, newPath: string, user: firebase.User | null): Observable<any> {
    const newFileRef = this.storage.ref(newPath)

    const listRef = this.storage.ref('users/' + user!.uid + '/profile-photo/')

    // upload
    return from(newFileRef.put(file)).pipe(
      switchMap(() => {
        // get url
        return newFileRef.getDownloadURL().pipe(
            switchMap((url: string) => {
              // update user
              return from(user!.updateProfile({ photoURL: url })).pipe(
                switchMap(() => {
                  // list all photos
                  return listRef.listAll().pipe(
                    switchMap((resultList) => {
                      if(resultList.items.length > 1) {
                        const metadataPromisses = resultList.items.map(item => item.getMetadata())
                        // all metadatas
                        return from(Promise.all(metadataPromisses)).pipe(
                          switchMap(metadatas => {
                            const sortedList = resultList.items.sort((a: Reference, b: Reference) => {
                              const aTime = new Date(metadatas[resultList.items.indexOf(a)].timeCreated).getTime()
                              const bTime = new Date(metadatas[resultList.items.indexOf(b)].timeCreated).getTime()
                              
                              return bTime - aTime
                            })
                            // delete oldest one
                            return from(sortedList[1].delete()).pipe(
                              catchError(err => {
                                console.error('Erro ao deletar imagem antiga: ')
                                throw err
                              })
                            )
                          })
                        )
                      }
                      return of({})
                    }),
                    catchError(err => {
                      console.error('Erro ao listar as fotos: ')
                      throw err
                    })
                  )
                }),
                catchError(err => {
                  console.error('Erro ao atualizar a foto de perfil: ')
                  throw err
                }),
              )
            }),
            catchError(err => {
              console.error('Erro ao atualizar o perfil do usuário: ')
              throw err
            })
          )
      }
      ),
      catchError(err => {
        console.error('Erro no upload da imagem: ')
        throw err
      })
   )
  }

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
            this.isListResultEmpty = false
            this.images = this.sortByLatest(allImages)
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