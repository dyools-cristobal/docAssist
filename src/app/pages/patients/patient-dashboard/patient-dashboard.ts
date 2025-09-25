import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientsService, Patient } from '../../../shared/patients.service';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from '../../../shared/appointment.service';
import { ConfirmStartAppointment } from '../../../shared/confirm-start-appointment/confirm-start-appointment';

@Component({
  standalone: true,
  selector: 'app-patient-dashboard',
  imports: [MatIconModule, MatListModule, NgIf],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.scss'
})
export class PatientDashboard implements OnInit {
  private route = inject(ActivatedRoute);
  private patientsService = inject(PatientsService);
  private appointmentsService = inject(AppointmentService); // <--
  private dialog = inject(MatDialog);

  patient?: Patient;

  constructor(private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('patientID');
    const appointmentID = this.route.snapshot.queryParamMap.get('appointmentID');

    if (!id) {
      console.warn('No patientID in query params');
      return;
    }

    this.patientsService.getPatientById(id).subscribe(p => {
      this.patient = p;

      // show appointment dialog if coming from dashboard
      if (appointmentID && p) {
        this.openAppointmentDialog(appointmentID, p);
      }
    });
  }

  private openAppointmentDialog(appointmentID: string, patient: Patient) {
    const dialogRef = this.dialog.open(ConfirmStartAppointment, {
      data: { patientName: `${patient.firstName} ${patient.lastName}` },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
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

  goToInfo() {
    this.router.navigate(['/patient-information'], { state: { patient: this.patient } });
  }
  goToGrowth() {
    this.router.navigate(['/patient-growth']);
  }
  goToCalendar(patient: Patient) {
    this.router.navigate(['/patient-calendar', patient.id], {
      queryParams: { name: patient.firstName + ' ' + patient.lastName, gender: patient.gender }
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
