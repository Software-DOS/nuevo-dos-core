import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAplicantesComponent } from './lista-aplicantes.component';

describe('ListaAplicantesComponent', () => {
  let component: ListaAplicantesComponent;
  let fixture: ComponentFixture<ListaAplicantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaAplicantesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaAplicantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
