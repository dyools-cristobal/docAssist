import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientsService, Patient } from '../../../shared/patients.service';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from '../../../shared/appointment.service';
import { ConfirmStartAppointment } from '../../../shared/confirm-start-appointment/confirm-start-appointment';
import { MatButtonModule } from '@angular/material/button';
import { AddPatientGrowth } from '../patient-growth/add-patient-growth/add-patient-growth';

@Component({
  standalone: true,
  selector: 'app-patient-dashboard',
  imports: [MatIconModule, MatListModule, NgIf, MatButtonModule],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.scss',
})
export class PatientDashboard implements OnInit {
  private route = inject(ActivatedRoute);
  private patientsService = inject(PatientsService);
  private appointmentsService = inject(AppointmentService); // <--
  private dialog = inject(MatDialog);
  private dialogOpened = false;
  patient?: Patient | undefined;

  appointmentID: string | null = '';
  patientID: string | null = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.patientID = this.route.snapshot.queryParamMap.get('patientID');
    this.appointmentID = this.route.snapshot.queryParamMap.get('appointmentID');

    if (!this.patientID) {
      console.warn('No patientID in query params');
      return;
    }

    this.patientsService.getPatientById(this.patientID).subscribe((p) => {
      this.patient = p;

      // show appointment dialog if coming from dashboard
      if (this.appointmentID !== null && p && !this.dialogOpened) {
        this.dialogOpened = true;
        this.openAppointmentDialog(this.appointmentID, p);
      }
    });
  }

  private openAppointmentDialog(appointmentID: string | null, patient: Patient) {
    const dialogRef = this.dialog.open(ConfirmStartAppointment, {
      data: { patientName: `${patient.firstName} ${patient.lastName}` },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // doctor clicked Yes
        this.appointmentsService.updateStatus(appointmentID, 'in-progress').then(() => {
          console.log(`Appointment ${appointmentID} set to in-progress`);
        });
      } else {
        console.log('Doctor chose not to start the appointment.');
      }
    });
  }

  startAppointment() {
      if (this.appointmentID !== null && this.patient) {
        this.openAppointmentDialog(this.appointmentID, this.patient);
      }
    ;
  }

  goToInfo() {
    this.router.navigate(['/patient-information'], { state: { patient: this.patient } });
  }
  
  addNewGrowthRecord() {
    const dialogRef = this.dialog.open(AddPatientGrowth, {
      data: { patientID: `${this.patientID}` },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
    if (result) {
      // result should contain {height, weight, month}
      if (this.patient && this.patient.id) {
        await this.patientsService.addGrowthRecord(this.patient.id, result);
        console.log('Growth record added successfully');
      } else {
        console.error('Patient or patient ID is undefined.');
      }
    }
  });
  }
  goToCalendar(patient: Patient) {
    this.router.navigate(['/patient-calendar', patient.id], {
      queryParams: { name: patient.firstName + ' ' + patient.lastName, gender: patient.gender },
    });
  }
  goToHistory() {
    this.router.navigate(['/patient-history']);
  }

  getAge(dob: any): number {
    if (!dob) return 0;

    const birthDate = dob.toDate ? dob.toDate() : new Date(dob); // handles Firestore Timestamp or Date
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
