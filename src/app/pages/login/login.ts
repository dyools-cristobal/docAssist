import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth.service';
import { Loading } from '../../shared/loading/loading';



@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule,  MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, Loading],
  templateUrl: './login.html',
  styleUrl: 'login.scss'
})
export class LoginComponent {
  // fb = inject(FormBuilder);
  // auth = inject(AuthService);
  // router = inject(Router);

  // form = this.fb.group({
  //   email: ['', [Validators.required, Validators.email]],
  //   password: ['', [Validators.required]]
  // });

  // async submit() {
  //   const { email, password } = this.form.value;
  //   if (!email || !password) return;
  //   await this.auth.login(email, password);
  //   this.router.navigate(['/dashboard']);
  // }
  
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  loading = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  async submit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.form.disable();  // disable inputs

    const { email, password } = this.form.value;

    try {
      await this.auth.login(email!, password!);
      this.snackBar.open('Login successful!', 'OK', { duration: 3000, panelClass: ['snack-success'] });
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.snackBar.open(err.message || 'Login failed', 'Close', { duration: 4000, panelClass: ['snack-error'] });
    } finally {
      this.loading.set(false);
      this.form.enable();
    }
  }
}
