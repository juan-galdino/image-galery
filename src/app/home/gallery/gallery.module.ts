import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './gallery.component';
import { NoImagesImageComponent } from './no-images-image/no-images-image.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    GalleryComponent,
    NoImagesImageComponent,
  ],
  imports: [
    CommonModule,
    GalleryRoutingModule,
    MatButtonModule,
  ]
})
export class GalleryModule { }
