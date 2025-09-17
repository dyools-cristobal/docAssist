import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './core/auth.service';
import { AsyncPipe, NgIf, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, AsyncPipe, NgIf, MatIconModule ],
  template: `
    <mat-toolbar color="primary" *ngIf="auth.user$ | async as user">
      <button mat-icon-button *ngIf="showBackButton()" (click)="goBack()">
    <mat-icon>arrow_back</mat-icon>
  </button>
      <span>DocAssist</span>
      <span class="spacer"></span>
      <button mat-button (click)="handleLogout()">Logout</button>
    </mat-toolbar>
    <router-outlet/>
  `,
  styles: [`.spacer{flex:1}`]
})
export class AppComponent {
  auth = inject(AuthService);


  constructor(public route: Router, private location: Location) {}

  goBack() {
    this.location.back();
  }

  showBackButton(): boolean {
    return this.route.url !== '/dashboard';
  }
  async handleLogout() {
    await this.auth.logout();
    this.route.navigate(['/login']);
  }
}