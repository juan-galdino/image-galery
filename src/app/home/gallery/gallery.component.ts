import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseStorageService } from '../../firebase-storage.service';
import { ImageProps } from '../../shared/image-props.model';
import { AuthenticationService } from 'src/app/auth/auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy {
  images: ImageProps[] = []
  isLoadding$!: Observable<boolean>
  isImagesArrayEmpty$!: Observable<boolean>
  userSubscription!: Subscription | null
  imagesSubscription!: Subscription | null

  constructor(
    private authService: AuthenticationService,
    private firebaseStorageService: FirebaseStorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe()
    this.imagesSubscription?.unsubscribe()
  }
}
