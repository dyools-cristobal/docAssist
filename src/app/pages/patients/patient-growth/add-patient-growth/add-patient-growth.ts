// import { Component, inject } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';

// @Component({
//   selector: 'app-add-patient-growth',
//   standalone: true,
//   imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
//   templateUrl: './add-patient-growth.html',
//   styleUrls: ['./add-patient-growth.scss'],
// })
// export class AddPatientGrowth {
//   private fb = inject(FormBuilder);
//   private dialogRef = inject(MatDialogRef<AddPatientGrowth>);
//   private data = inject(MAT_DIALOG_DATA);

//   form: FormGroup = this.fb.group({
//     height: [null, [Validators.required, Validators.min(1)]],
//     weight: [null, [Validators.required, Validators.min(1)]],
//     month: [null, [Validators.required, Validators.min(0)]],
//   });

//   save() {
//     if (this.form.valid) {
//       this.dialogRef.close(this.form.value);
//     }
//   }

//   cancel() {
//     this.dialogRef.close(null);
//   }
// }
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
      id: [data.record?.id || null] // keep the id if editing
    });
  }

  save() {
    if (this.form.valid) {
      const record: GrowthRecord = this.form.value;
      this.dialogRef.close(record); // return the record object
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
