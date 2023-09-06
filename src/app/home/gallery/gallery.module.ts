import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './gallery.component';
import { NoImagesImageComponent } from './no-images-image/no-images-image.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { FullScreenImageComponent } from 'src/app/shared/components/full-screen-image/full-screen-image.component';


@NgModule({
  declarations: [
    GalleryComponent,
    NoImagesImageComponent,
    DialogContentComponent,
    FullScreenImageComponent
  ],
  imports: [
    CommonModule,
    GalleryRoutingModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ]
})
export class GalleryModule { }
