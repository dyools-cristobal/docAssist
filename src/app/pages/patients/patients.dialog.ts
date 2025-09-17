import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../shared/patients.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  standalone: true,
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.html',
  styleUrls: ['./patient-dialog.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
    private dialogRef: MatDialogRef<PatientDialogComponent>
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      tob: ['', Validators.required],
      gender: ['']
    });
  }

  save() {
    if (this.form.valid) {
      const raw = this.form.value;

      const newPatient: Patient = {
        ...raw,
        dob: raw.dob instanceof Date ? raw.dob.toISOString().split('T')[0] : raw.dob,
        tob: raw.tob || ''
      };

      this.dialogRef.close(newPatient);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
