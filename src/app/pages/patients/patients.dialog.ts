import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../shared/patients.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule, MatDateSelectionModel } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  standalone: true,   // ✅ must be standalone since we import modules here
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.html',
  styleUrls: ['./patient-dialog.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,   // ✅ only reactive forms needed
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
})
export class PatientDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PatientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { patient?: Patient }
  ) {
    this.form = this.fb.group({
      firstName: [data?.patient?.firstName || '', Validators.required],
      lastName: [data?.patient?.lastName || '', Validators.required],
      dob: [data?.patient?.dob || '', Validators.required],
      tob: [data?.patient?.tob || '', Validators.required],
      gender: [data?.patient?.gender || '']
    });
  }

  save() {
  if (this.form.valid) {
    const raw = this.form.value;

    const updatedPatient: Patient = {
      ...this.data?.patient,
      ...raw,
      dob: raw.dob instanceof Date ? raw.dob.toISOString().split('T')[0] : raw.dob,
      tob: raw.tob || ''
    };

    this.dialogRef.close(updatedPatient);
  }
}



  close() {
    this.dialogRef.close();
  }
}
