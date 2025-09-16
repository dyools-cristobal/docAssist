import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: 'calendar',  canActivate: [authGuard], loadComponent: () => import('./pages/calendar/calendar').then(m => m.CalendarComponent) },
  { path: 'patients',  canActivate: [authGuard], loadComponent: ()   => import('./pages/patients/patients-list').then(m => m.PatientsListComponent) },
  { path: 'patient-dashboard',  canActivate: [authGuard], loadComponent: ()   => import('./pages/patients/patient-dashboard/patient-dashboard').then(m => m.PatientDashboard) },
  { path: 'patient-information',  canActivate: [authGuard], loadComponent: ()   => import('./pages/patients/patient-information/patient-information').then(m => m.PatientInformation) },
  { path: 'patient-history',  canActivate: [authGuard], loadComponent: ()   => import('./pages/patients/patient-history/patient-history').then(m => m.PatientHistory) },
  { path: 'patient-growth',  canActivate: [authGuard], loadComponent: ()   => import('./pages/patients/patient-growth/patient-growth').then(m => m.PatientGrowth) },
  { path: 'patient-calendar',  canActivate: [authGuard], loadComponent: ()   => import('./pages/patients/patient-calendar/patient-calendar').then(m => m.PatientCalendar) },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' },
 

];

