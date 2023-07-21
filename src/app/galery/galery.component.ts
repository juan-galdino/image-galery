import { Component, OnInit } from '@angular/core';
import { FirebaseStorageService } from '../firebase-storage.service';
import { ImageProps } from '../shared/image-props.model';

@Component({
  selector: 'app-galery',
  templateUrl: './galery.component.html',
  styleUrls: ['./galery.component.css']
})
export class GaleryComponent implements OnInit {
  images: ImageProps[] = []
  
  constructor(private firebaseStorageService: FirebaseStorageService) {}

  ngOnInit(): void {
    this.firebaseStorageService.getImagesUrls().subscribe(data => { 
      this.images = data
    })
  }
}
