import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadImagesRoutingModule } from './upload-images-routing.module';
import { UploadImagesComponent } from './upload-images.component';
import { DragAndDropDirective } from '../../shared/drag-and-drop.directive';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    UploadImagesComponent,
    DragAndDropDirective
  ],
  imports: [
    CommonModule,
    UploadImagesRoutingModule,
    MatProgressBarModule,
    MatButtonModule
  ]
})
export class UploadImagesModule { }
