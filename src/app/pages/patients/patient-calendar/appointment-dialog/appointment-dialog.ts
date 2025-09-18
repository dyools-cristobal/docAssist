import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Firestore, addDoc, collection, doc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  templateUrl: './appointment-dialog.html',
  styleUrl: './appointment-dialog.scss',
})
export class AppointmentDialog implements OnInit {
  private fb = inject(FormBuilder);
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private dialogRef = inject(MatDialogRef<AppointmentDialog>);
  private data = inject(MAT_DIALOG_DATA);

  form: FormGroup = this.fb.group({
    date: ['', Validators.required],
    time: ['', Validators.required],
    type: ['', Validators.required],
    details: [''],
    status: ['waiting', Validators.required],
  });

  ngOnInit() {
    console.log(this.data)
    if (this.data?.appointment) {
      const appt = { ...this.data.appointment };

      // 🔹 Convert Firestore Timestamp to JS Date
      if (appt.date?.toDate) {
        appt.date = appt.date.toDate();
      }

      this.form.patchValue(appt);
    }
  }

  async save() {
    if (this.form.invalid) return;
    const user = this.auth.currentUser;
    if (!user) return;

    let dateToSave = this.form.value.date;
    if (dateToSave?.toDate) {
      dateToSave = dateToSave.toDate();
    } else if (typeof dateToSave === 'string') {
      dateToSave = new Date(dateToSave);
    }

    const appointment = {
      ...this.form.value,
      date: dateToSave,
      patientId: this.data.patientId ?? this.data.appointment?.patientId,
      patientName: this.data.patientName ?? this.data.appointment?.patientName,
      patientGender: this.data.patientGender ?? this.data.appointment?.patientGender,
      doctorId: user.uid,
    };

    if (this.data?.appointment?.id) {
      // 🔹 Update existing appointment
      const apptRef = doc(this.firestore, 'appointments', this.data.appointment.id);
      await updateDoc(apptRef, appointment);
    } else {
      // 🔹 Add new appointment
      const appointmentsRef = collection(this.firestore, 'appointments');
      await addDoc(appointmentsRef, appointment);
    }

    this.dialogRef.close(appointment);
  }

  close() {
    this.dialogRef.close();
  }
}
