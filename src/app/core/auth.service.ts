// import { Injectable, inject, signal } from '@angular/core';
// import { Auth, user, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
// import { Observable } from 'rxjs';
// import { toSignal } from '@angular/core/rxjs-interop';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private auth = inject(Auth);
//   user$: Observable<import('firebase/auth').User | null> = user(this.auth);

//    currentUser = toSignal(user(this.auth));
//   login(email: string, password: string) {
//     return signInWithEmailAndPassword(this.auth, email, password);
//   }
//   logout() { return signOut(this.auth); }
// }

import { Injectable, inject, signal } from '@angular/core';
import { Auth, user, signInWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, collection, getDocs } from '@angular/fire/firestore';
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
  
  // Add credential signal
  private credentialSignal = signal<UserCredential | null>(null);
  credential = this.credentialSignal.asReadonly();

  // Update the clinic signal type to handle array
  private clinicSignal = signal<Clinic[] | null>(null);
  clinic = this.clinicSignal.asReadonly();

  async login(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    this.credentialSignal.set(credential);
    
    // Get and set clinic data
    const clinicData = await this.getUserClinic(credential.user.uid);
    this.clinicSignal.set(clinicData || null);
    
    return credential;
  }

  logout() { 
    this.credentialSignal.set(null);
    this.clinicSignal.set(null);
    return signOut(this.auth); 
  }

  async addClinic(userId: string, clinicData: Clinic) {
    const clinicRef = doc(collection(this.firestore, `users/${userId}/clinics`));
    return setDoc(clinicRef, {
      ...clinicData,
      id: clinicRef.id,
      createdAt: new Date().toISOString()
    });
  }

  async getUserClinic(userId: string) {
    console.log('Fetching clinics for user:', userId);
    const clinicsRef = collection(this.firestore, `users/${userId}/clinics`);
    const clinicsSnap = await getDocs(clinicsRef);
    
    if (clinicsSnap.empty) {
      console.log('No clinics found for user');
      return undefined;
    }
  
    // Map all clinic documents to Clinic objects
    const clinics = clinicsSnap.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as Clinic[];
    
    console.log('Clinics data:', clinics);
    return clinics;
  }
  

}