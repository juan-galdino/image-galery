import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FirebaseStorageService } from '../../firebase-storage.service';
import { ImageProps } from '../../shared/image-props.model';
import { AuthenticationService } from 'src/app/auth/auth.service';
import { Observable, Subscription, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from 'src/app/shared/components/dialog-content/dialog-content.component';

import firebase from 'firebase/compat';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy {
  isMediumScreen = false
  isLargeScreen = false
  user!: firebase.User | null
  images: ImageProps[] = []
  previewImage!: ImageProps
  isLoadding$!: Observable<boolean>
  isImagesArrayEmpty$!: Observable<boolean>
  isGalleryMode!: boolean
  galleryModeSub!: Subscription 
  isFullScreenMode = false
  imageUrl!: string
  userSubscription!: Subscription | null
  imagesSubscription!: Subscription | null

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthenticationService,
    private firebaseStorageService: FirebaseStorageService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.galleryModeSub = this.firebaseStorageService.getViewMode()
      .subscribe(value => {
        this.isGalleryMode = value
      })

    const mediumScreenWidth = '(min-width: 37.5em)'
    const largeScreenWidth = '(min-width: 47.9375em)'

    this.breakpointObserver.observe([mediumScreenWidth, largeScreenWidth]).subscribe( ()=> {
      this.isMediumScreen = false

      if ( this.breakpointObserver.isMatched(mediumScreenWidth) ) { 
        this.isMediumScreen = true
        this.isLargeScreen = false
      }
      
      if ( this.breakpointObserver.isMatched(largeScreenWidth) ) {
        this.isLargeScreen = true
      }
      
    })

    this.userSubscription = this.authService.user$.subscribe(user => {
      if(user) {
        this.user = user
        this.fetchImages(user.uid)
      }
    })
    
    this.isLoadding$ = this.firebaseStorageService.isLoadding$
    this.isImagesArrayEmpty$ = this.firebaseStorageService.isImagesArrayEmpty$
  }

  fetchImages(userId: string) {
    this.imagesSubscription = this.firebaseStorageService.getImagesUrls(userId).subscribe(data => { 
      this.images = data
      this.imageUrl = this.images[0].url
      this.previewImage = this.images[0]
    }, (error: any) => {
      console.log(error)
    })
  }

  toggleGaleryMode() {
    this.isGalleryMode = !this.isGalleryMode
    this.firebaseStorageService.setViewMode(this.isGalleryMode)
  }

  headsToUploadImagesPage() {
    this.router.navigate(['home/upload'])
  }

  deleteImage(imageName: string, imageIndex: number) {
    const dialogRef = this.dialog.open(DialogContentComponent, {
      data: { userFileName: imageName, uid: this.user?.uid }
    })

    dialogRef.afterClosed().pipe(
      catchError(err => {
        throw err
      })
    ).subscribe(result => {

      if(result === "from delete button") {
        this.firebaseStorageService.images.splice(imageIndex, 1)
        this.showImageInPreview(0)
      }

      if(this.firebaseStorageService.images.length === 0) {
        this.firebaseStorageService.isListResultEmpty = true
        this.firebaseStorageService.isImagesArrayEmpty.next(true)
      }
    })
  }

  getShortName(imageName: string): string {
    return imageName.length > 8 ? imageName.substring(0, 10) + "..." : imageName
  }

  getRelativeTime(timeCreated: string): string {
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

  showImageInFullScreen(imageIndex: number) {
    this.isFullScreenMode = true
    this.imageUrl = this.images[imageIndex].url
  }

  showImageInPreview(imageIndex: number) {
    this.imageUrl = this.images[imageIndex].url
    this.previewImage = this.images[imageIndex]
  }

  closeFullScreenMode() {
    this.isFullScreenMode = false
  }

  ngOnDestroy(): void {
    this.galleryModeSub.unsubscribe()
    this.userSubscription?.unsubscribe()
    this.imagesSubscription?.unsubscribe()
  }
}
