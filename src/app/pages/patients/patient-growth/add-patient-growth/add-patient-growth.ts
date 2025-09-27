import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GrowthRecord } from '../../../../shared/patients.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-patient-growth',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './add-patient-growth.html',
  styleUrls: ['./add-patient-growth.scss']
})
export class AddPatientGrowth {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddPatientGrowth>,
    @Inject(MAT_DIALOG_DATA) public data: { patientId: string; record?: GrowthRecord }
  ) {
    this.form = this.fb.group({
      month: [data.record?.month || '', Validators.required],
      height: [data.record?.height || '', Validators.required],
      weight: [data.record?.weight || '', Validators.required],
    });
  }

  save() {
    if (this.form.valid) {
      const result = this.form.value;

      // ✅ If editing, preserve record.id in memory only
      if (this.data.record?.id) {
        this.dialogRef.close({ ...result, id: this.data.record.id });
      } else {
        // ✅ If adding, don't return id at all
        this.dialogRef.close(result);
      }
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
