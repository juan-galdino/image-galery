import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { GaleryComponent } from './galery/galery.component';
import { UploadImagesComponent } from './upload-images/upload-images.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GaleryComponent,
    UploadImagesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
