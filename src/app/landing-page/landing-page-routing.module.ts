import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';
import { landingPageGuard } from './landing-page.guard';

const routes: Routes = [{
  path: "", component: LandingPageComponent, canActivate: [landingPageGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule { }
