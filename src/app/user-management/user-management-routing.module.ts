import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { userManagementGuard } from './user-management.guard';

const routes: Routes = [{
  path: "", 
  component: UserManagementComponent, 
  canActivate:[userManagementGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
