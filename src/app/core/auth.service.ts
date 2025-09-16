import { Injectable, inject } from '@angular/core';
import { Auth, user, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  user$: Observable<import('firebase/auth').User | null> = user(this.auth);

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  logout() { return signOut(this.auth); }
}
