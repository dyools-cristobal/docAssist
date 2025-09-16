import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc, docData, getDoc } from '@angular/fire/firestore';
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
  emergencyContact: { name: string; relation: string; contact: string; };
  homeAddress: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({ providedIn: 'root' })
export class PatientsService {
  private fs = inject(Firestore);
  private patientsCol = collection(this.fs, 'patients');
  private patients: Patient[] = [];

  constructor(private firestore: Firestore) {}
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
    const patientRef = doc(this.fs, 'patients', id);
    return updateDoc(patientRef, { ...patient });
  }

  // Remove a patient
  remove(id: string) {
    const patientRef = doc(this.fs, 'patients', id);
    return deleteDoc(patientRef);
  }



  getPatientById(id: string): Observable<Patient | undefined> {
    const ref = doc(this.firestore, `patients/${id}`);
    // docData returns an Observable of the doc data; { idField: 'id' } injects the doc.id into the result
    return docData(ref, { idField: 'id' }) as Observable<Patient | undefined>;
  }
}
