import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { authGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path:"",
    pathMatch: "full",
    redirectTo: "galeria"
  },
  
  { 
    path:"",
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: "galeria", loadChildren: () => import("./gallery/gallery.module").then(m => m.GalleryModule) },
      { path: "upload", loadChildren: () => import("./upload-images/upload-images.module").then(m => m.UploadImagesModule) }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
