import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioSolicitudComponent } from './formulario-solicitud.component';

describe('FormularioSolicitudComponent', () => {
  let component: FormularioSolicitudComponent;
  let fixture: ComponentFixture<FormularioSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioSolicitudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
