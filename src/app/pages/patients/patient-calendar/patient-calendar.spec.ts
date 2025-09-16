import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCalendar } from './patient-calendar';

describe('PatientCalendar', () => {
  let component: PatientCalendar;
  let fixture: ComponentFixture<PatientCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
