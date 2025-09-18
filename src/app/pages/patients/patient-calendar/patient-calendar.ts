import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { AppointmentDialog } from './appointment-dialog/appointment-dialog';
import { MatCardModule } from '@angular/material/card';
import { NgFor, AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { orderBy } from '@angular/fire/firestore';

export interface Appointment {
  id?: string;
  patientId: string;
  patientName?: string;
  patientGender?: string;
  doctorId: string;
  date: any; // ISO string YYYY-MM-DD
  time: string; // HH:mm
  type: string;
  details: string;
  status: 'waiting' | 'in-progress' | 'done' | 'cancelled';
}
@Component({
  selector: 'app-patient-calendar',
  imports: [MatCardModule, MatIconModule, MatButtonModule, NgFor, AsyncPipe, CommonModule, MatTooltipModule],
  templateUrl: './patient-calendar.html',
  styleUrl: './patient-calendar.scss',
})
export class PatientCalendar {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);

  appointments$!: Observable<Appointment[]>;
  patientId!: string;
  patientName!: string;
  patientGender!: string;
  ngOnInit() {
  this.route.paramMap.subscribe((params) => {
    this.patientId = params.get('id')!; 
  });

  this.route.queryParamMap.subscribe((params) => {
    this.patientName = params.get('name') || '';
    this.patientGender = params.get('gender') || '';
  });

  const user = this.auth.currentUser;
  if (!user || !this.patientId) return;

  const appointmentsRef = collection(this.firestore, 'appointments');
  const q = query(
    appointmentsRef,
    where('doctorId', '==', user.uid),
    where('patientId', '==', this.patientId)
  );

  this.appointments$ = collectionData(q, { idField: 'id' }) as Observable<Appointment[]>;
}


  openDialog() {
    const dialogRef = this.dialog.open(AppointmentDialog, {
      data: { 
        patientId: this.patientId,
        patientName: this.patientName,
        patientGender: this.patientGender },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // handled in dialog
      }
    });
  }

  // Cycle status waiting -> in-progress -> done
  cycleStatus(appt: Appointment) {
    let nextStatus: 'waiting' | 'in-progress' | 'done' = 'waiting';

    if (appt.status === 'waiting') {
      nextStatus = 'in-progress';
    } else if (appt.status === 'in-progress') {
      nextStatus = 'done';
    } else if (appt.status === 'done') {
      nextStatus = 'waiting';
    }

    // Update Firestore
    const ref = doc(this.firestore, 'appointments', appt.id!);
    updateDoc(ref, { status: nextStatus });
  }

  // Return color depending on status
  getStatusColor(status: string): 'primary' | 'accent' | 'warn' | undefined {
    switch (status) {
      case 'waiting':
        return 'primary'; // Blue
      case 'in-progress':
        return 'accent'; // Pink
      case 'done':
        return 'warn'; // Red (or change to 'accent' if you prefer green style)
      default:
        return undefined;
    }
  }

  async editAppointment(appt: Appointment) {
    // open dialog and pass the whole appointment as data so dialog can prefill the form
    const dialogRef = this.dialog.open(AppointmentDialog, {
      width: '420px',
      data: { 
      appointment: appt,
      patientId: this.patientId,
      patientName: this.patientName,
      patientGender: this.patientGender
    },
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      // result is the updated appointment object returned by the dialog (or undefined if cancelled)
      if (!result) return;

      // normalize date to a JS Date (Firestore accepts JS Date and will store a Timestamp)
      let dateToSave = result.date;
      if (dateToSave?.toDate) {
        // Firestore Timestamp -> JS Date
        dateToSave = dateToSave.toDate();
      } else if (typeof dateToSave === 'string') {
        dateToSave = new Date(dateToSave);
      } // else assume it's already a Date

      const apptRef = doc(this.firestore, 'appointments', appt.id!);

      const updatedPayload = {
        ...result,
        date: dateToSave,
        updatedAt: new Date(),
      };

      try {
        await updateDoc(apptRef, updatedPayload);
        console.log('Appointment updated');
      } catch (err) {
        console.error('Failed to update appointment', err);
      }
    });
  }

  getStatusTooltip(status: string): string {
  switch (status) {
    case 'waiting': return 'Click to mark as In-Progress';
    case 'in-progress': return 'Click to mark as Done';
    case 'done': return 'Appointment completed';
    default: return '';
  }
}
}
