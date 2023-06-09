import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { Routes, RouterModule } from '@angular/router';
import { GuestGuardService } from '../../services/guest-guard.service';
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [ GuestGuardService ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class LoginModule {

}
