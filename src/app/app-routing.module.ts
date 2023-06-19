import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GaleryComponent } from "./galery/galery.component";
import { UploadImagesComponent } from "./upload-images/upload-images.component";

const routes: Routes = [
  { path: "", component: GaleryComponent },
  { path: "upload", component: UploadImagesComponent } 
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]  
})
export class AppRoutingModule {}