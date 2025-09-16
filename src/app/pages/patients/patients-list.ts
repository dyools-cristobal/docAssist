import { Component, inject, signal, computed } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PatientsService, Patient } from '../../shared/patients.service';
import { DatePipe } from '@angular/common';
import { PatientDialogComponent } from './patients.dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-patients-list',
  imports: [ MatTableModule, MatIconModule, MatButtonModule, MatIconModule, MatDialogModule, DatePipe, FormsModule, MatFormFieldModule, MatInputModule, MatSortModule],
  templateUrl: './patients-list.html',
  styleUrl: './patients-list.scss'
})
export class PatientsListComponent {
  // private svc = inject(PatientsService);
  private dialog = inject(MatDialog);

  patients = signal<Patient[]>([]);
  cols = ['name', 'actions'];
  searchTerm = '';
  dataSource = new MatTableDataSource<Patient>();
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private svc: PatientsService, private router: Router) {
    this.svc.list().subscribe(data => {
      this.patients.set(data);
      this.dataSource.data = data;
    });
  }
ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  openAdd() {
    this.dialog.open(PatientDialogComponent, {

      data: null   // ✅ make sure dialog knows it's "add mode"
    }).afterClosed().subscribe((val: Patient | undefined) => {
      if (val) this.svc.add(val);
    });
  }
  editPatient(patient: Patient) {
  this.dialog.open(PatientDialogComponent, {

    data: { patient }
  }).afterClosed().subscribe((updated: Patient | undefined) => {
    if (updated && patient.id) {
      this.svc.update(patient.id, {
        firstName: updated.firstName,
        lastName: updated.lastName,
        dob: updated.dob,
        gender: updated.gender
      });
    }
  });
}
  remove(id: string) { this.svc.remove(id); }

  filteredPatients() {
    const term = this.searchTerm.toLowerCase();
    this.dataSource.data = this.patients().filter(p =>
      p.firstName.toLowerCase().includes(term) ||
      p.lastName.toLowerCase().includes(term) ||
      p.dob.includes(term)
    );
    return this.dataSource;
  }

  goToDashboard(patient: Patient) {
  if (patient.id) {
    this.router.navigate(['/patient-dashboard'], { queryParams: { patientID: patient.id } });
  }
  
}

}
