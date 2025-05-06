import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeProgresoComponent } from './gauge-progreso.component';

describe('GaugeProgresoComponent', () => {
  let component: GaugeProgresoComponent;
  let fixture: ComponentFixture<GaugeProgresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GaugeProgresoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GaugeProgresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
