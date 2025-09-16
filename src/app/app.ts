import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './core/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, AsyncPipe, NgIf],
  template: `
    <mat-toolbar color="primary" *ngIf="auth.user$ | async as user">
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
  router = inject(Router);

  async handleLogout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}