import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Medicine {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface PrescriptionEntry {
  appointmentId: string;
  date: string; // ISO string (e.g. new Date().toISOString())
  doctorId: string;
  prescriptions: Medicine[];
}

@Injectable({
  providedIn: 'root'
})
export class PrescriptionsService {
  private firestore = inject(Firestore);

  /**
   * Add a prescription entry to a patient's prescriptions subcollection
   */
  async addPrescription(patientId: string, data: PrescriptionEntry): Promise<void> {
    if (!patientId) {
      throw new Error('Patient ID is required');
    }

    try {
      const prescriptionsRef = collection(this.firestore, `patients/${patientId}/prescriptions`);
      console.log('Adding prescription:', {
        path: prescriptionsRef.path,
        data
      });
      
      const docRef = await addDoc(prescriptionsRef, {
        ...data,
        createdAt: new Date().toISOString() // Add timestamp
      });
      
      console.log('Prescription added successfully:', docRef.id);
      return;
    } catch (error) {
      console.error('Error adding prescription:', error);
      throw error; // Re-throw to handle in component
    }
  }

  /**
   * Get all prescriptions for a patient
   */
  getPrescriptions(patientId: string): Observable<PrescriptionEntry[]> {
    const prescriptionsRef = collection(this.firestore, `patients/${patientId}/prescriptions`);
    return collectionData(prescriptionsRef, { idField: 'id' }) as Observable<PrescriptionEntry[]>;
  }

  /**
   * Get prescriptions by appointment ID
   */
  getPrescriptionByAppointment(patientId: string, appointmentId: string): Observable<PrescriptionEntry[]> {
    const prescriptionsRef = collection(this.firestore, `patients/${patientId}/prescriptions`);
    const q = query(prescriptionsRef, where('appointmentId', '==', appointmentId));
    return collectionData(q, { idField: 'id' }) as Observable<PrescriptionEntry[]>;
  }
}
