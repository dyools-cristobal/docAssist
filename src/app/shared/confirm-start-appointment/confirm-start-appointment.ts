import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-confirm-start-appointment',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-start-appointment.html',
  styleUrl: './confirm-start-appointment.scss'
})
export class ConfirmStartAppointment {
constructor(
    public dialogRef: MatDialogRef<ConfirmStartAppointment>,
    @Inject(MAT_DIALOG_DATA) public data: { patientName: string }
  ) {}
}
