import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './gallery.component';
import { NoImagesImageComponent } from './no-images-image/no-images-image.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { DialogContentComponent } from '../../shared/components/dialog-content/dialog-content.component';
import { FullScreenImageComponent } from 'src/app/shared/components/full-screen-image/full-screen-image.component';


@NgModule({
  declarations: [
    GalleryComponent,
    NoImagesImageComponent,
    DialogContentComponent,
    FullScreenImageComponent,
  ],
  imports: [
    CommonModule,
    GalleryRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatInputModule
  ]
})
export class GalleryModule { }
