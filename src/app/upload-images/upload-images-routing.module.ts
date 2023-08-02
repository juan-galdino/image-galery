import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadImagesComponent } from './upload-images.component';
import { authGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path:'', component: UploadImagesComponent, canActivate: [authGuard]  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadImagesRoutingModule { }
