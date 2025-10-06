import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { PrescriptionsService } from '../../../shared/prescriptions.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-patient-prescriptions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './patient-prescriptions.html',
  styleUrls: ['./patient-prescriptions.scss'],
})
export class PatientPrescriptions {
  prescriptionForm: FormGroup;
  patientId: string;
  patientName: string;
  currentDate: Date = new Date();
  doctorId: string;
  doctorName: string = 'Dr.';
  appointmentId: string;

  // Dropdown options
  frequencyOptions = ['Once daily', 'Twice daily', 'Thrice daily', 'As needed'];
  durationOptions = ['3 days', '5 days', '7 days', '10 days', '2 weeks'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PatientPrescriptions>,
    @Inject(MAT_DIALOG_DATA)
    public data: { patientId: string; patientName?: string; appointmentId?: string; doctorId?: string; doctorName?: string },
    private prescriptionsService: PrescriptionsService
  ) {
    // ✅ Capture the passed data here
    this.patientId = this.data.patientId;
    this.patientName = this.data.patientName || 'Unknown Patient';
    this.doctorId = this.data.doctorId || '';
    this.doctorName = this.data.doctorName || 'Dr.';
    this.appointmentId = this.data.appointmentId || '';

    // ✅ Initialize form
    this.prescriptionForm = this.fb.group({
      prescriptions: this.fb.array([this.createPrescriptionRow()]),
    });
  }

  get prescriptions(): FormArray {
    return this.prescriptionForm.get('prescriptions') as FormArray;
  }

  createPrescriptionRow(): FormGroup {
    return this.fb.group({
      medicineName: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      duration: ['', Validators.required],
      notes: [''],
    });
  }

  addPrescription() {
    this.prescriptions.push(this.createPrescriptionRow());
  }

  removePrescription(index: number) {
    this.prescriptions.removeAt(index);
  }

  async save() {
    if (this.patientId) {
      if (this.prescriptionForm.valid) {
        const prescriptionData = {
          appointmentId: this.appointmentId,
          doctorId: this.doctorId,
          date: new Date().toISOString(),
          prescriptions: this.prescriptionForm.value.prescriptions,
        };

        try {
          await this.prescriptionsService.addPrescription(this.patientId, prescriptionData);
          console.log('✅ Prescription successfully added!');
          this.generatePDF();
          this.dialogRef.close(true);
        } catch (error) {
          console.error('❌ Error saving prescription:', error);
        }
      } else {
        console.warn('⚠️ Form is invalid.');
      }
    } else {
      console.log(this.patientId);
    }
  }

    async generatePDF() {
  try {
    const element = document.getElementById('print-section');
    if (!element) {
      console.error('Print section not found');
      return;
    }

    // First, generate canvas with specific options
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      backgroundColor: '#ffffff',
      useCORS: true,
      removeContainer: true,
      logging: false,
      onclone: (clonedDoc) => {
        const element = clonedDoc.getElementById('print-section');
        if (element) {
          element.style.visibility = 'visible';
          element.style.backgroundColor = '#ffffff';
          element.style.color = '#000000';
        }
      }
    });

    // Calculate dimensions (A4 paper size)
    const imgWidth = 210;
    const pixelRatio = canvas.width / imgWidth;
    const imgHeight = canvas.height / pixelRatio;

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Add image to PDF (using JPEG format instead of PNG)
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 1.0),
      'JPEG',
      0,
      0,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );

    // Save the PDF
    pdf.save(`prescription_${new Date().toISOString().slice(0,10)}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}
  cancel() {
    this.dialogRef.close();
  }
}
