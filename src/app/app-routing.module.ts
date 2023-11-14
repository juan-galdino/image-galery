import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", pathMatch: "full", loadChildren: () => import('./landing-page/landing-page.module').then(m => m.LandingPageModule) },
  { path: "login", loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: "gerenciamento-de-usuarios", loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule) },
  { path: "cadastro", loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule) },
  { path: "home", loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: "**", redirectTo: "home/galeria" } 
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]  
})
export class AppRoutingModule {}