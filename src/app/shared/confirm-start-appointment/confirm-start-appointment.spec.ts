import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmStartAppointment } from './confirm-start-appointment';

describe('ConfirmStartAppointment', () => {
  let component: ConfirmStartAppointment;
  let fixture: ComponentFixture<ConfirmStartAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmStartAppointment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmStartAppointment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
