import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FirebaseStorageService } from '../../firebase-storage.service';
import { ImageProps } from '../../shared/image-props.model';
import { AuthenticationService } from 'src/app/auth/auth.service';
import { Observable, Subscription, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from './dialog-content/dialog-content.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy {
  isMediumScreen = false
  images: ImageProps[] = []
  isLoadding$!: Observable<boolean>
  isImagesArrayEmpty$!: Observable<boolean>
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
    const customWidth = '(min-width: 37.5em)'
    this.breakpointObserver.observe([customWidth]).subscribe( ()=> {
      this.isMediumScreen = false

      if ( this.breakpointObserver.isMatched(customWidth) ) { 
        this.isMediumScreen = true
      } 
      
    })

    this.userSubscription = this.authService.user$.subscribe(user => {
      if(user) {
        this.fetchImages(user.uid)
      }
    })
    
    this.isLoadding$ = this.firebaseStorageService.isLoadding$
    this.isImagesArrayEmpty$ = this.firebaseStorageService.isImagesArrayEmpty$
  }

  fetchImages(userId: string) {
    this.imagesSubscription = this.firebaseStorageService.getImagesUrls(userId).subscribe(data => { 
      this.images = data
    }, (error: any) => {
      console.log(error)
    })
  }

  headsToUploadImagesPage() {
    this.router.navigate(['home/upload'])
  }

  openDialog(imageName: string) {
    const dialogRef = this.dialog.open(DialogContentComponent, {
      data: { name: imageName }
    })

    dialogRef.afterClosed().pipe(
      catchError(err => {
        throw err
      })
    ).subscribe(result => {
      if(result) {
        console.log(result)
      }
    })
  }

  getShortName(imageName: string): string {
    return imageName.length > 8 ? imageName.substring(0, 10) + "..." : imageName
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe()
    this.imagesSubscription?.unsubscribe()
  }
}
