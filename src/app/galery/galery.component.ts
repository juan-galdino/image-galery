import { Component, OnInit } from '@angular/core';
import { FirebaseStorageService } from '../firebase-storage.service';

@Component({
  selector: 'app-galery',
  templateUrl: './galery.component.html',
  styleUrls: ['./galery.component.css']
})
export class GaleryComponent implements OnInit {
  imagesUrls: string[] = []
  
  constructor(private firebaseStorageService: FirebaseStorageService) {}

  ngOnInit(): void {
    this.firebaseStorageService.getImagesUrls().subscribe(urls => { 
      this.imagesUrls = urls 
    })
  }
}
