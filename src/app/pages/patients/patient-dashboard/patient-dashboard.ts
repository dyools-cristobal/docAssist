import { Component, effect, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PatientsService, Patient } from '../../../shared/patients.service';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from '../../../shared/appointments.service';
import { ConfirmStartAppointment } from '../../../shared/confirm-start-appointment/confirm-start-appointment';
import { Appointment } from '../../../shared/appointment/appointment';
import { MatButtonModule } from '@angular/material/button';
import { AddPatientGrowth } from '../patient-growth/add-patient-growth/add-patient-growth';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { normalGrowthMale, normalGrowthFemale } from '../../../shared/constants/growth';
import { PatientPrescriptions } from '../patient-prescriptions/patient-prescriptions';
import { AuthService } from '../../../core/auth.service';
import { doc } from 'firebase/firestore';

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

  constructor(private router: Router,private authService: AuthService) {
    effect(() => {
      const docLicenses = this.authService.userDoc();
      if (docLicenses) {
        console.log('UserDoc loaded:', docLicenses);
      }
    });
  }

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

  addNewPrescription() {
    const doctorId = this.authService.currentUser()?.uid;
    const doctorName = this.authService.currentUser()?.displayName || 'Dr.';
    const doctorData = this.authService.currentUser();
    const docLicenses = this.authService.userDoc();
    const clinics = this.authService.clinic();

    if (!doctorId) {
      console.error('No authenticated doctor found');
      return;
    }
    const dialogRef = this.dialog.open(PatientPrescriptions, {
      data: { 
        patientId: `${this.patientID}`,
        patientName: `${this.patient?.firstName} ${this.patient?.lastName}`,

        patientAge: `${this.getAge(this.patient?.dob)}`,
        patientData: this.patient,
        appoinementId: `${this.appointmentID}`,
        doctorId: `${doctorId}`,
        doctorName: `${doctorName}`,
        doctorData: doctorData,
        docLicenses: docLicenses,
        clinics: clinics || []
      },
      maxHeight: '90vh',
      maxWidth: '90vw',
      disableClose: false,
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

  getAge(dob: any): string {
  if (!dob) return '0';
  
  const birthDate = dob.toDate ? dob.toDate() : new Date(dob);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Adjust for upcoming birthdays
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  // If less than 1 year old, calculate months instead
  if (age <= 0) {
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + monthDiff;
    if (dayDiff < 0) months--; // if not yet reached current month's day
    if (months < 0) months = 0;
    return `${months} month${months !== 1 ? 's' : ''}`;
  }

  return age.toString();
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
