import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PatientsService, Patient } from '../../../shared/patients.service';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';


@Component({
  standalone: true,
  selector: 'app-patient-dashboard',
  imports: [MatIconModule],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.scss'
})
export class PatientDashboard {
  private route = inject(ActivatedRoute);
  private patientsService = inject(PatientsService);
  private sub?: Subscription;
  patient?: Patient;

  constructor(
    private router: Router,
  ) { }

    ngOnInit() {
      const id = this.route.snapshot.queryParamMap.get('patientID');
  if (!id) {
    console.warn('No patientID in query params');
    return;
  }

  this.patientsService.getPatientById(id).subscribe(p => {
    this.patient = p;
  });
    }
  goToInfo() {
    this.router.navigate(['/patient-information'], { state: { patient: this.patient } });
  }
  goToGrowth() {
    this.router.navigate(['/patient-growth']);
  }
  goToCalendar(patient: Patient) {
    this.router.navigate(['/patient-calendar', patient.id],{
      queryParams: { name: patient.firstName+' '+patient.lastName, gender: patient.gender }
    });
  }
  goToHistory() {
    this.router.navigate(['/patient-history']);
  }
}
