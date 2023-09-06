import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageProps } from '../../image-props.model';

@Component({
  selector: 'app-full-screen-image',
  templateUrl: './full-screen-image.component.html',
  styleUrls: ['./full-screen-image.component.css']
})
export class FullScreenImageComponent implements OnInit{

  @Input() currentImage!: string
  @Input() images!: ImageProps[]
  imagesUrls!: string[]

  @Output() close = new EventEmitter<void>()
  
  ngOnInit(): void {
    this.imagesUrls = this.images.map(image => image.url)
  }

  onPrevious() {
    const currentIndex = this.imagesUrls.indexOf(this.currentImage)
    if(currentIndex > 0) {
      this.currentImage = this.imagesUrls[currentIndex - 1]
    }
  }

  onNext() {
    const currentIndex = this.imagesUrls.indexOf(this.currentImage)
    if(currentIndex < this.imagesUrls.length - 1) {
      this.currentImage = this.imagesUrls[currentIndex + 1]
    }
  }

  onClose() {
    this.close.emit()
  }
}
