import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/registrer.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { FileUploaderComponent } from './dashboard/file-uploader.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [{ path: '', component: FileUploaderComponent }],
    
  },
];
