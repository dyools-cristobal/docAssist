import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register-user',
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './register-user.html',
  styleUrl: './register-user.scss'
})
export class RegisterUser {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  registerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', Validators.required],
    specialty: ['']
  });

  async onRegister() {
    const { name, email, password, role, specialty } = this.registerForm.value;

    try {
      // Create Auth user
      const cred = await createUserWithEmailAndPassword(this.auth, email, password);

      // Set displayName
      await updateProfile(cred.user, { displayName: name });

      // Create Firestore profile
      const userRef = doc(this.firestore, `users/${cred.user.uid}`);
      await setDoc(userRef, {
        id: cred.user.uid,
        name,
        email,
        role,
        specialty: role === 'doctor' ? specialty : null,
        doctorIds: role === 'assistant' ? [] : null,
        assistantIds: role === 'doctor' ? [] : null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('User registered successfully');
    } catch (err) {
      console.error('Registration error', err);
    }
  }
}
