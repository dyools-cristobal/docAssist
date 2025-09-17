import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Patient, PatientsService } from '../../../shared/patients.service';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';  
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-patient-information',
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatExpansionModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatDividerModule, 
    MatChipsModule
  ],
  standalone: true,
  templateUrl: './patient-information.html',
  styleUrl: './patient-information.scss',
})
export class PatientInformation {
  patient?: Patient;
  isEditing = false;
  form: FormGroup;
  constructor(private router: Router, private fb: FormBuilder, private svc: PatientsService) {
    const nav = this.router.getCurrentNavigation();
    this.patient = nav?.extras.state?.['patient'];
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dob: ['', Validators.required],
      timeOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      gestationAge: [''],
      birthWeight: [''],
      birthLength: [''],
      headCirc: [''],
      chestCirc: [''],
      abdomenCirc: [''],
      newbornScreening: [''],
      bloodType: [''],
      allergies: [[]],
      perinatalHistory: [''],
      motherName: [''],
      motherAge: [''],
      motherOccupation: [''],
      motherContact: ['', [Validators.pattern(/^[0-9]{10,15}$/)]],
      motherEmail: ['', Validators.email],
      fatherName: [''],
      fatherAge: [''],
      fatherOccupation: [''],
      fatherContact: [''],
      fatherEmail: [''],
      // Home
      address: ['', Validators.required],
      homeNumber: ['', [Validators.pattern(/^[0-9]{7,15}$/)]],
    });
  }

  ngOnInit(): void {
    if (this.patient) {
      console.log(this.patient);
      this.form.patchValue({
        firstName: this.patient.firstName,
        middleName: this.patient.middleName || '',
        lastName: this.patient.lastName,
        dob: this.patient.dob
          ? new Date(this.patient.dob.seconds * 1000 + this.patient.dob.nanoseconds / 1e6)
          : null,
        timeOfBirth: this.patient.tob || '',
        gender: this.patient.gender || '',
        gestationAge: this.patient.gestationAge || '',
        birthWeight: this.patient.birthWeight || '',
        birthLength: this.patient.birthLength || '',
        headCirc: this.patient.headCirc || '',
        chestCirc: this.patient.chestCirc || '',
        abdomenCirc: this.patient.abdomenCirc || '',
        bloodType: this.patient.bloodType || '',
        allergies: this.patient.allergies || [],
        perinatalHistory: this.patient.perinatalHistory || '',
        newbordScreening: this.patient.newbornScreening || '',
        // Mother

        motherName: this.patient.motherName || null,
        motherdob: this.patient.motherdob || null,
        motherOccupation: this.patient.motherOccupation || null,
        motherContact: this.patient.motherContact || null,
        motherEmail: this.patient.motherEmail || null,

        fatherName: this.patient.fatherName || null,
        fatherdob: this.patient.fatherdob || null,
        fatherOccupation: this.patient.fatherOccupation || null,
        fatherContact: this.patient.fatherContact || null,
        fatherEmail: this.patient.fatherEmail || null,

        // Home
        address: this.patient.address || null,
        homeNumber: this.patient.homeNumber || null,
      });
    }
  }
  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.patient?.id) {
      console.error('No patient ID found');
      return;
    }

    try {
      await this.svc.update(this.patient.id, this.form.value);
      console.log('Patient updated successfully');
      this.router.navigate(['/patient-dashboard'], {
        queryParams: { patientID: this.patient.id },
      });
    } catch (err) {
      console.error('Error updating patient:', err);
    }
  }

  enableEditing() {
    this.isEditing = !this.isEditing;
  }
}
