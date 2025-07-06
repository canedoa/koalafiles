import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/registrer.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { FileUploaderComponent } from './dashboard/file-uploader.component';
import { HomeComponent } from './layout/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [{ path: '', component: FileUploaderComponent }],
  },
];
