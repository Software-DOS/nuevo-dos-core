import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCapacitacionesComponent } from './lista-capacitaciones.component';

describe('ListaCapacitacionesComponent', () => {
  let component: ListaCapacitacionesComponent;
  let fixture: ComponentFixture<ListaCapacitacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaCapacitacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCapacitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
