import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../../core/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss']
})
export class UserProfile {
  private firestore = inject(Firestore);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  profileForm: FormGroup;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      specialty: [''],
      assistantIds: [[]],
      licenseNumber: [''],
      PTRNumber: [''],
      S2Number: ['']
    });

    // 👇 Reactively listen for userDoc changes using an effect
    effect(() => {
      const user = this.auth.userDoc();
      if (user) {
        console.log('UserDoc loaded:', user);
        this.profileForm.patchValue({
          name: user.name || '',
          specialty: user.specialty || '',
          licenseNumber: user.licenseNumber || '',
          PTRNumber: user.PTRNumber || '',
          S2Number: user.S2Number || ''
        });
      }
    });
  }

  async updateProfile() {
    const user = this.auth.userDoc(); // 👈 get current value reactively
    if (!user?.id) {
      this.errorMessage = 'User not found.';
      return;
    }

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const userRef = doc(this.firestore, `users/${user.id}`);

    try {
      await updateDoc(userRef, this.profileForm.value);
      this.successMessage = 'Profile updated successfully!';
    } catch (err: any) {
      this.errorMessage = 'Failed to update profile: ' + err.message;
    } finally {
      this.isSaving = false;
    }
  }
}
