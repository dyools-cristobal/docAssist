import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PatientsService, Patient } from '../../../shared/patients.service';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {  NgIf } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-patient-dashboard',
  imports: [MatIconModule, MatListModule, NgIf],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.scss'
})
export class PatientDashboard {
  private route = inject(ActivatedRoute);
  private patientsService = inject(PatientsService);
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
