import { Injectable, inject } from '@angular/core';
import { Firestore, doc, updateDoc, collection, docData, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Appointment {
  id?: string;
  patientId: string;
  doctorId: string;
  date: any;          // Firestore Timestamp or Date
  status: string;     // "scheduled" | "in progress" | "completed" | "cancelled"
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private firestore = inject(Firestore);
  private appointmentsRef = collection(this.firestore, 'appointments');

  // ✅ Get all appointments
  getAppointments(): Observable<Appointment[]> {
    return collectionData(this.appointmentsRef, { idField: 'id' }) as Observable<Appointment[]>;
  }

  // ✅ Get one appointment by ID
  getAppointmentById(id: string): Observable<Appointment | undefined> {
    const ref = doc(this.firestore, `appointments/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<Appointment | undefined>;
  }

  // ✅ Update status of an appointment
  async updateStatus(id: string | null, status: string): Promise<void> {
    const ref = doc(this.firestore, `appointments/${id}`);
    await updateDoc(ref, { status });
  }

  // ✅ Add extra helpers later (reschedule, add notes, delete etc.)
}
