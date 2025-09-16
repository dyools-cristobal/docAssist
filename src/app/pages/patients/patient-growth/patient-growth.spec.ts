import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientGrowth } from './patient-growth';

describe('PatientGrowth', () => {
  let component: PatientGrowth;
  let fixture: ComponentFixture<PatientGrowth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientGrowth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientGrowth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
