// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-calendar',
//   imports: [],
//   templateUrl: './calendar.html',
//   styleUrl: './calendar.scss'
// })
// export class Calendar {

// }

import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  standalone: true,
  selector: 'app-calendar',
  providers: [provideNativeDateAdapter()],
  imports: [MatDatepickerModule, MatFormFieldModule, MatInputModule],
  template: `
  <div class="wrap">
    <mat-form-field appearance="outline">
      <mat-label>Pick a date</mat-label>
      <input matInput [matDatepicker]="picker">
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  </div>
  `,
  styles: [`.wrap{padding:16px;display:flex}`]
})
export class CalendarComponent {}
