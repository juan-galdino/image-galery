import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadImagesRoutingModule } from './upload-images-routing.module';
import { UploadImagesComponent } from './upload-images.component';


@NgModule({
  declarations: [
    UploadImagesComponent
  ],
  imports: [
    CommonModule,
    UploadImagesRoutingModule
  ]
})
export class UploadImagesModule { }
