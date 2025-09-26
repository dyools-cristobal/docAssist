import { Component, Input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PatientsService, GrowthRecord } from '../../../shared/patients.service';
import { AddPatientGrowth } from './add-patient-growth/add-patient-growth';
import { ActivatedRoute } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-patient-growth',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './patient-growth.html',
  styleUrls: ['./patient-growth.scss']
})
export class PatientGrowth implements OnInit {
  @Input() patientId!: string;

  displayedColumns: string[] = ['month', 'height', 'weight', 'actions'];
  data: GrowthRecord[] = [];

  constructor(
    private route: ActivatedRoute,
    private patients: PatientsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (!this.patientId) {
      this.patientId = this.route.snapshot.paramMap.get('id')!;
    }
    this.load();
  }

  async load() {
    this.data = await this.patients.getGrowthRecords(this.patientId);
  }

  add() {
    const dialogRef = this.dialog.open(AddPatientGrowth, {
      data: { patientId: this.patientId }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.patients.addGrowthRecord(this.patientId, result);
        this.load();
      }
    });
  }

  edit(record: GrowthRecord) {
  const dialogRef = this.dialog.open(AddPatientGrowth, {
    data: { patientId: this.patientId, record }
  });

  dialogRef.afterClosed().subscribe(async result => {
    if (result) {
      if (record.id) {
        await this.patients.editGrowthRecord(this.patientId, record.id, {
          month: result.month,
          height: result.height,
          weight: result.weight,
        });
        this.load();
      }
    }
  });
}


  async delete(record: GrowthRecord) {
    console.log('Deleting growth record', record);
    if (record.id) {
      await this.patients.deleteGrowthRecord(this.patientId, record.id);
      this.load();
    }
  }
}
