import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CalendarComponent } from "../calendar/calendar";
import { PatientsListComponent } from "../patients/patients-list";

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [MatTabsModule, RouterOutlet, CalendarComponent, PatientsListComponent],
  templateUrl: './dashboard.html',
  styles: [`
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;padding:16px}
    mat-card{cursor:pointer;padding:24px;font-size:18px}
  `]
})
export class DashboardComponent {
  selectedIndex = 0;

  constructor(private router: Router) {}

  onTabChange(index: number) {
    switch (index) {
      case 0:
        this.router.navigate(['dashboard']);
        break;
      case 1:
        this.router.navigate(['dashboard/calendar']);
        break;
      case 2:
        this.router.navigate(['dashboard/patients']);
        break;
    }
  }
}
