import { Injectable, inject, signal, effect } from '@angular/core';
import {
  Auth,
  user,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

export interface Clinic {
  phoneNumber: any;
  id?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  schedule?: {
    open: string;
    close: string;
    days: string[];
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  user$: Observable<import('firebase/auth').User | null> = user(this.auth);
  currentUser = toSignal(user(this.auth));

  private credentialSignal = signal<UserCredential | null>(null);
  credential = this.credentialSignal.asReadonly();

  private userDocSignal = signal<any | null>(this.loadUserDocFromStorage());
  userDoc = this.userDocSignal.asReadonly();

  private clinicSignal = signal<Clinic[] | null>(this.loadClinicsFromStorage());
  clinic = this.clinicSignal.asReadonly();

  constructor() {
    // Watch for changes and save to localStorage automatically
    effect(() => {
      const userDoc = this.userDocSignal();
      if (userDoc) {
        localStorage.setItem('userDoc', JSON.stringify(userDoc));
      } else {
        localStorage.removeItem('userDoc');
      }
    });

    effect(() => {
      const clinics = this.clinicSignal();
      if (clinics) {
        localStorage.setItem('clinics', JSON.stringify(clinics));
      } else {
        localStorage.removeItem('clinics');
      }
    });
  }

  async login(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    this.credentialSignal.set(credential);

    const userDoc = await this.getUserData(credential.user.uid);
    this.userDocSignal.set(userDoc || null);

    const clinicData = await this.getUserClinic(credential.user.uid);
    this.clinicSignal.set(clinicData || null);

    return credential;
  }

  logout() {
    this.credentialSignal.set(null);
    this.userDocSignal.set(null);
    this.clinicSignal.set(null);

    // Clear storage
    localStorage.removeItem('userDoc');
    localStorage.removeItem('clinics');

    return signOut(this.auth);
  }

  async addClinic(userId: string, clinicData: Clinic) {
    const clinicRef = doc(collection(this.firestore, `users/${userId}/clinics`));
    return setDoc(clinicRef, {
      ...clinicData,
      id: clinicRef.id,
      createdAt: new Date().toISOString(),
    });
  }

  async getUserData(userId: string) {
    const userRef = doc(this.firestore, `users/${userId}`);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.log('No such user document!');
      return null;
    }

    return { id: userSnap.id, ...userSnap.data() };
  }

  async getUserClinic(userId: string) {
    console.log('Fetching clinics for user:', userId);
    const clinicsRef = collection(this.firestore, `users/${userId}/clinics`);
    const clinicsSnap = await getDocs(clinicsRef);

    if (clinicsSnap.empty) {
      console.log('No clinics found for user');
      return undefined;
    }

    const clinics = clinicsSnap.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Clinic[];

    console.log('Clinics data:', clinics);
    return clinics;
  }

  private loadUserDocFromStorage() {
    const stored = localStorage.getItem('userDoc');
    return stored ? JSON.parse(stored) : null;
  }

  private loadClinicsFromStorage() {
    const stored = localStorage.getItem('clinics');
    return stored ? JSON.parse(stored) : null;
  }
}
