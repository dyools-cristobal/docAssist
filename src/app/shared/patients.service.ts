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
  getDocs,
  orderBy,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { getDoc } from 'firebase/firestore';

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

export interface GrowthRecord {
  id?: string;
  height: number;
  weight: number;
  month: number;
  createdAt?: Date; // optional for sorting/debug
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

 async getPatientById(id: string): Promise<{ patient: Patient; growth: GrowthRecord[] }> {
  // Get patient doc
  const patientDoc = doc(this.firestore, `patients/${id}`);
  const patientSnap = await getDoc(patientDoc);

  if (!patientSnap.exists()) {
    throw new Error(`Patient ${id} not found`);
  }

  const patient: Patient = {
    id: patientSnap.id,
    ...(patientSnap.data() as Omit<Patient, 'id'>),
  };

  // Get growth subcollection
  const growthCol = collection(this.firestore, `patients/${id}/growth`);
  const q = query(growthCol, orderBy('month', 'asc'));
  const growthSnap = await getDocs(q);

  const growth: GrowthRecord[] = growthSnap.docs.map(d => ({
    id: d.id, // ✅ always take Firestore doc id
    ...(d.data() as Omit<GrowthRecord, 'id'>),
  }));

  return { patient, growth };
}


  async addGrowthRecord(patientId: string, record: Omit<GrowthRecord, 'id'>) {
  const col = collection(this.firestore, `patients/${patientId}/growth`);
  
  // remove any accidental `id` before saving
  const { id, ...data } = record as GrowthRecord;
  return addDoc(col, {
    ...data,
    createdAt: new Date(),
  });
}


  // 🔹 Get all growth records for a patient (sorted by month)
  async getGrowthRecords(patientID: string): Promise<GrowthRecord[]> {
    const growthCol = collection(this.firestore, `patients/${patientID}/growth`);
    const q = query(growthCol, orderBy('month', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as GrowthRecord),
    }));
  }

  async editGrowthRecord(patientID: string, recordID: string, updates: Partial<GrowthRecord>) {
  const growthDoc = doc(this.firestore, `patients/${patientID}/growth/${recordID}`);
  const { id, ...cleanUpdates } = updates;
  await updateDoc(growthDoc, {
    ...cleanUpdates,
    updatedAt: new Date(),
  });
}

  // 🔹 Delete a growth record by ID
  async deleteGrowthRecord(patientID: string, recordID: string): Promise<void> {
    const growthDoc = doc(this.firestore, `patients/${patientID}/growth/${recordID}`);
    await deleteDoc(growthDoc);
  }
}
