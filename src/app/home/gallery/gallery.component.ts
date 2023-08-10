import { Component, OnInit } from '@angular/core';
import { FirebaseStorageService } from '../../firebase-storage.service';
import { ImageProps } from '../../shared/image-props.model';
import { AuthenticationService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  images: ImageProps[] = []
  isLoadding$!: Observable<boolean>
  
  constructor(
    private authService: AuthenticationService,
    private firebaseStorageService: FirebaseStorageService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if(user) {
        this.fetchImages(user.uid)
      }
    })
    this.isLoadding$ = this.firebaseStorageService.isLoadding$
  }

  fetchImages(userId: string) {
    this.firebaseStorageService.getImagesUrls(userId).subscribe(data => { 
      this.images = data
    }, (error: any) => {
      console.log(error)
    })
  }
}
