import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoCapacitacionesComponent } from './empleado-capacitaciones.component';

describe('EmpleadoCapacitacionesComponent', () => {
  let component: EmpleadoCapacitacionesComponent;
  let fixture: ComponentFixture<EmpleadoCapacitacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpleadoCapacitacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadoCapacitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
