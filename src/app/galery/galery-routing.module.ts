import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GaleryComponent } from './galery.component';
import { authGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: '', component: GaleryComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GaleryRoutingModule { }
