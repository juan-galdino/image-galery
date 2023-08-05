import { Component, OnInit } from '@angular/core';
import { FirebaseStorageService } from '../../firebase-storage.service';
import { ImageProps } from '../../shared/image-props.model';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  images: ImageProps[] = []
  
  constructor(private firebaseStorageService: FirebaseStorageService) {}

  ngOnInit(): void {
    this.firebaseStorageService.getImagesUrls().subscribe(data => { 
      this.images = data
    })
  }
}
