import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PatientsService, Patient } from '../../../shared/patients.service';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from '../../../shared/appointment.service';
import { ConfirmStartAppointment } from '../../../shared/confirm-start-appointment/confirm-start-appointment';
import { Appointment } from '../../../shared/appointment/appointment';
import { MatButtonModule } from '@angular/material/button';
import { AddPatientGrowth } from '../patient-growth/add-patient-growth/add-patient-growth';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { normalGrowthMale, normalGrowthFemale } from '../../../shared/constants/growth';

@Component({
  standalone: true,
  selector: 'app-patient-dashboard',
  imports: [MatIconModule, MatListModule, NgIf, MatButtonModule, NgChartsModule, RouterLink],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.scss',
})
export class PatientDashboard implements OnInit {
  private route = inject(ActivatedRoute);
  private patientsService = inject(PatientsService);
  private appointmentsService = inject(AppointmentService);
  private dialog = inject(MatDialog);
  private dialogOpened = false;

  patient?: Patient;
  appointmentID: string | null = '';
  patientID: string | null = '';
  patientGrowth: any[] = [];

  // Chart data
  heightChartData!: ChartData<'line'>;
  weightChartData!: ChartData<'line'>;

  // Chart options
  heightChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x', // or 'y' or 'xy'
        },
        zoom: {
          wheel: {
            enabled: true, // zoom with mouse wheel
          },
          pinch: {
            enabled: true, // zoom with pinch on trackpad/touch
          },
          mode: 'x', // zoom along x axis (months)
        },
      },
    },
    scales: {
      x: { title: { display: true, text: 'Months' } },
      y: { title: { display: true, text: 'Height (cm)' }, beginAtZero: true },
    },
  };

  weightChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x', // or 'y' or 'xy'
        },
        zoom: {
          wheel: {
            enabled: true, // zoom with mouse wheel
          },
          pinch: {
            enabled: true, // zoom with pinch on trackpad/touch
          },
          mode: 'x', // zoom along x axis (months)
        },
      },
    },
    scales: {
      x: { title: { display: true, text: 'Months' } },
      y: { title: { display: true, text: 'Weight (kg)' }, beginAtZero: true },
    },
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.patientID = this.route.snapshot.queryParamMap.get('patientID');
    this.appointmentID = this.route.snapshot.queryParamMap.get('appointmentID');

    if (!this.patientID) {
      console.warn('No patientID in query params');
      return;
    }

    this.patientsService.getPatientById(this.patientID).then((result) => {
      this.patient = result.patient;
      this.patientGrowth = result.growth;

      this.setupCharts();

      if (this.appointmentID && result.patient && !this.dialogOpened) {
        this.dialogOpened = true;
        this.openAppointmentDialog(this.appointmentID, result.patient);
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
        this.appointmentsService.updateStatus(appointmentID, 'in-progress').then(() => {
          console.log(`Appointment ${appointmentID} set to in-progress`);
          const appointmentDialogRef = this.dialog.open(Appointment, {
            data: {message: 'Appointment Flow'},
            disableClose: true,
            maxWidth: '90vw',
            maxHeight: '90vh'
            // panelClass: 'appointment-dialog-fullscreen'
          });
        });
      } else {
        console.log('Doctor chose not to start the appointment.');
      }
    });
  }

  startAppointment() {
    if (this.appointmentID && this.patient) {
      this.openAppointmentDialog(this.appointmentID, this.patient);
    }
  }

  goToInfo() {
    this.router.navigate(['/patient-information'], { state: { patient: this.patient } });
  }

  addNewGrowthRecord() {
    const dialogRef = this.dialog.open(AddPatientGrowth, {
      data: { patientID: `${this.patientID}` },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && this.patient?.id) {
        await this.patientsService.addGrowthRecord(this.patient.id, result);
        console.log('Growth record added successfully');
      }
    });
  }

  goToCalendar(patient: Patient) {
    this.router.navigate(['/patient-calendar', patient.id], {
      queryParams: { name: `${patient.firstName} ${patient.lastName}`, gender: patient.gender },
    });
  }

  goToHistory() {
    this.router.navigate(['/patient-history']);
  }

  goToGrowth() {
    this.router.navigate(['/patient-growth']);
  }

  getAge(dob: any): number {
    if (!dob) return 0;
    const birthDate = dob.toDate ? dob.toDate() : new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Growth Charts
  private setupCharts() {
    if (!this.patient) return;

    const reference = this.patient.gender === 'male' ? normalGrowthMale : normalGrowthFemale;

    this.heightChartData = {
      datasets: [
        {
          label: 'WHO Normal Height',
          data: reference.map((g) => ({ x: g.month, y: g.height })),
          borderColor: 'gray',
          borderDash: [1, 5],
          tension: 0.4,
          pointRadius: 0,
        },
        {
          label: 'Patient Height (cm)',
          data: this.patientGrowth.map((g) => ({ x: g.month, y: g.height })),
          borderColor: 'blue',
          backgroundColor: 'rgba(54, 162, 235, 0.3)',
          tension: 0.4,
          pointRadius: 4,
        },
      ],
    };

    this.weightChartData = {
      datasets: [
        {
          label: 'WHO Normal Weight',
          data: reference.map((g) => ({ x: g.month, y: g.weight })),
          borderColor: 'gray',
          borderDash: [1, 5],
          tension: 0.3,
          pointRadius: 0,
        },
        {
          label: 'Patient Weight (kg)',
          data: this.patientGrowth.map((g) => ({ x: g.month, y: g.weight })),
          borderColor: 'green',
          backgroundColor: 'rgba(75, 192, 192, 0.3)',
          tension: 0.3,
          pointRadius: 4,
        },
      ],
    };

    // ✅ ensure x-axis is linear (already set in your ChartOptions)
    this.heightChartOptions = {
      ...this.heightChartOptions,
      scales: {
        x: { type: 'linear', title: { display: true, text: 'Months' } },
        y: { title: { display: true, text: 'Height (cm)' }, beginAtZero: true },
      },
    };

    this.weightChartOptions = {
      ...this.weightChartOptions,
      scales: {
        x: { type: 'linear', title: { display: true, text: 'Months' } },
        y: { title: { display: true, text: 'Weight (kg)' }, beginAtZero: true },
      },
    };
  }
}
