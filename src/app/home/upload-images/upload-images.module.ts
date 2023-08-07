import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadImagesRoutingModule } from './upload-images-routing.module';
import { UploadImagesComponent } from './upload-images.component';
import { DragAndDropDirective } from '../../shared/drag-and-drop.directive';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    UploadImagesComponent,
    DragAndDropDirective
  ],
  imports: [
    CommonModule,
    UploadImagesRoutingModule,
    MatProgressBarModule
  ]
})
export class UploadImagesModule { }
