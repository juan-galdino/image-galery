import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", loadChildren: () => import('./galery/galery.module').then(m => m.GaleryModule), pathMatch: 'full' },
  { path: "upload", loadChildren: () => import('./upload-images/upload-images.module').then(m => m.UploadImagesModule) } 
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]  
})
export class AppRoutingModule {}