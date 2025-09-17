import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  docData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Patient {
  id?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: any;
  tob: any;
  gender: string;
  headCirc: number;
  chestCirc: number;
  abdomenCirc: number;
  bloodType: string;
  address: any;
  homeNumber: any;

  gestationAge: string;
  birthWeight: string;
  birthLength: string;
  perinatalHistory: string;
  complications: string;
  allergies: string;
  newbornScreening: string;
  growthCharts: string;
  notes: string;

  motherName: string;
  motherContact: string;
  motherEmail: string;
  motherdob: any;
  motherOccupation: string;

  fatherName: string;
  fatherContact: string;
  fatherEmail: string;
  fatherdob: any;
  fatherOccupation: string;
  emergencyContact: { name: string; relation: string; contact: string };
  homeAddress: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({ providedIn: 'root' })
export class PatientsService {
  private firestore: Firestore = inject(Firestore); // ✅ inject once
  private patientsCol = collection(this.firestore, 'patients');

  // Get all patients
  list(): Observable<Patient[]> {
    return collectionData(this.patientsCol, { idField: 'id' }) as Observable<Patient[]>;
  }

  // Add a new patient
  add(patient: Patient) {
    return addDoc(this.patientsCol, patient);
  }

  // Update an existing patient
  update(id: string, patient: Partial<Patient>) {
    const patientRef = doc(this.firestore, 'patients', id);
    return updateDoc(patientRef, { ...patient });
  }

  // Remove a patient
  remove(id: string) {
    const patientRef = doc(this.firestore, 'patients', id);
    return deleteDoc(patientRef);
  }

  // Get patient by ID
  getPatientById(id: string): Observable<Patient | undefined> {
    const ref = doc(this.firestore, `patients/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<Patient | undefined>;
  }
}
