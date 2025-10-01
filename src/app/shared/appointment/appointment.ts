import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {  MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule, 
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './appointment.html',
  styleUrls: ['./appointment.scss']
})
export class Appointment {
  growthForm: FormGroup;
  medicalForm: FormGroup;
  vaccinationForm: FormGroup;
  symptomsForm: FormGroup;
  consultationForm: FormGroup;
  commonSymptoms = [
  "Fever",
  "Cough",
  "Cold",
  "Runny Nose",
  "Sore Throat",
  "Headache",
  "Stomach Pain",
  "Vomiting",
  "Diarrhea",
  "Constipation",
  "Rash",
  "Ear Pain",
  "Toothache",
  "Shortness of Breath",
  "Fatigue",
  "Loss of Appetite",
  "Dizziness",
  "Muscle Pain",
  "Joint Pain",
  "Nausea"
];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  public selectedSymptoms: string[] = [];
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<Appointment>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.growthForm = this.fb.group({
      month: [''],
      height: [''],
      weight: [''],
    });

    this.medicalForm = this.fb.group({
      medicalRecords: [''], // file or text
    });

    this.vaccinationForm = this.fb.group({
      vaccinations: [''],
    });

    this.symptomsForm = this.fb.group({
      symptoms: [''],
    });

    this.consultationForm = this.fb.group({
      notes: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.vaccinationForm = this.fb.group({
      vaccinations: this.fb.array([this.newVaccinationRow()])
    });

    this.symptomsForm.get('symptoms')?.valueChanges.subscribe((values: string[]) => {
    this.selectedSymptoms = values || [];
  });
  }

  // Getter for easy access
  get vaccinations(): FormArray {
    return this.vaccinationForm.get('vaccinations') as FormArray;
  }

  // Create a new row
  newVaccinationRow(): FormGroup {
    return this.fb.group({
      vaccine: [''],
      dose: [''],
      site: [''],
      brand: [''],
      batch: [''],
      clinic: ['']
    });
  }

  addVaccination() {
    this.vaccinations.push(this.newVaccinationRow());
  }

  removeVaccination(index: number) {
    this.vaccinations.removeAt(index);
  }


  addSymptom(event: any): void {
  const value = (event.value || '').trim();

  if (value) {
    if (!this.selectedSymptoms) {
      this.selectedSymptoms = [];
    }

    // Prevent duplicates
    if (!this.selectedSymptoms.includes(value)) {
      this.selectedSymptoms.push(value);

      // Sync form control once (no duplication)
      this.symptomsForm.get('symptoms')?.setValue(this.selectedSymptoms);
    }
  }

  // Clear input field
  if (event.input) {
    event.input.value = '';
  }
}

removeSymptom(symptom: string): void {
  const index = this.selectedSymptoms.indexOf(symptom);

  if (index >= 0) {
    this.selectedSymptoms.splice(index, 1);
    this.symptomsForm.get('symptoms')?.setValue(this.selectedSymptoms);
  }
}




  save() {
    const appointmentData = {
      growth: this.growthForm.value,
      medicalRecords: this.medicalForm.value,
      vaccinations: this.vaccinationForm.value,
      symptoms: this.symptomsForm.value,
      consultation: this.consultationForm.value,
      createdAt: new Date()
    };

    this.dialogRef.close(appointmentData);
  }

  close() {
    this.dialogRef.close();
  }
}
