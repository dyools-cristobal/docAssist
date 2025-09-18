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
  query,
  where,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

export interface Patient {
  id?: string;
  doctorId: string;
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
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private patientsCol = collection(this.firestore, 'patients');

  // 🔹 Get all patients for the current logged-in doctor
  list(): Observable<Patient[]> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No logged in user');

    const q = query(this.patientsCol, where('doctorId', '==', user.uid));
    return collectionData(q, { idField: 'id' }) as Observable<Patient[]>;
  }

  // 🔹 Add a new patient for the logged-in doctor
  async add(patient: Omit<Patient, 'doctorId' | 'createdAt' | 'updatedAt'>) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No logged in user');

    return addDoc(this.patientsCol, {
      ...patient,
      doctorId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // 🔹 Update an existing patient
  update(id: string, patient: Partial<Patient>) {
    const patientRef = doc(this.firestore, 'patients', id);
    return updateDoc(patientRef, { ...patient, updatedAt: new Date() });
  }

  // 🔹 Remove a patient
  remove(id: string) {
    const patientRef = doc(this.firestore, 'patients', id);
    return deleteDoc(patientRef);
  }

  // 🔹 Get patient by ID
  getPatientById(id: string): Observable<Patient | undefined> {
    const ref = doc(this.firestore, `patients/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<Patient | undefined>;
  }
}
