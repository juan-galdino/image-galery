import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadImagesRoutingModule } from './upload-images-routing.module';
import { UploadImagesComponent } from './upload-images.component';
import { DragAndDropDirective } from '../shared/drag-and-drop.directive';


@NgModule({
  declarations: [
    UploadImagesComponent,
    DragAndDropDirective
  ],
  imports: [
    CommonModule,
    UploadImagesRoutingModule
  ]
})
export class UploadImagesModule { }
