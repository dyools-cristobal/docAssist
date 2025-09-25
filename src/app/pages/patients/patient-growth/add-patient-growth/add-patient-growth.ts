import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-patient-growth',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './add-patient-growth.html',
  styleUrls: ['./add-patient-growth.scss'],
})
export class AddPatientGrowth {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddPatientGrowth>);
  private data = inject(MAT_DIALOG_DATA);

  form: FormGroup = this.fb.group({
    height: [null, [Validators.required, Validators.min(1)]],
    weight: [null, [Validators.required, Validators.min(1)]],
    month: [null, [Validators.required, Validators.min(0)]],
  });

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
