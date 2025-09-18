import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, query, where, collectionData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';


export interface Appointment {
  id?: string;
  patientId: string;
  patientName?: string;
  patientGender?: string;
  doctorId: string;
  status: 'waiting' | 'in-progress' | 'done' | 'cancelled';
  date: any;
  time: string; 
  type: string;
  details: string;
}

@Component({
  selector: 'app-dashboard-home',
  imports: [AsyncPipe, NgFor, NgIf, MatIconModule, DatePipe, MatButtonModule, CommonModule],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss'
})
export class DashboardHome {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private router = inject(Router);

  appointments$!: Observable<Appointment[]>;

  ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const appointmentsRef = collection(this.firestore, 'appointments');
    const q = query(
      appointmentsRef,
      where('doctorId', '==', user.uid),
      where('date', '>=', today),
      where('date', '<', tomorrow)
    );

    this.appointments$ = collectionData(q, { idField: 'id' }) as Observable<Appointment[]>;
  }

  goToPatient(patientId: string) {
    this.router.navigate(['/patient-dashboard'], { queryParams: { patientID: patientId } });
  }

  formatTime24to12(time: string): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = ((h + 11) % 12 + 1); // convert 0-23 → 1-12
  return `${hour}:${m.toString().padStart(2, '0')} ${suffix}`;
}

}
