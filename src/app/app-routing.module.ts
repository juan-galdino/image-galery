import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { authGuard } from "./auth/auth.guard";

const routes: Routes = [
  { path:"", pathMatch: "full", redirectTo: "gallery" },  
  { path: "gallery", loadChildren: () => import('./galery/galery.module').then(m => m.GaleryModule) },
  { path: "upload", loadChildren: () => import('./upload-images/upload-images.module').then(m => m.UploadImagesModule) },
  { path: "login", loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: "**", redirectTo: "gallery" } 
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]  
})
export class AppRoutingModule {}