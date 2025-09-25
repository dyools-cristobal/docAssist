import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './core/auth.service';
import { AsyncPipe, NgIf, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, AsyncPipe, NgIf, MatIconModule, MatMenuModule ],
  templateUrl: './app.html',
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