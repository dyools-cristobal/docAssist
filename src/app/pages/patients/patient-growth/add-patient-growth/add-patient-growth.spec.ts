import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientGrowth } from './add-patient-growth';

describe('AddPatientGrowth', () => {
  let component: AddPatientGrowth;
  let fixture: ComponentFixture<AddPatientGrowth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPatientGrowth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPatientGrowth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
