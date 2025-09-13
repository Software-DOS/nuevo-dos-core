import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefeEvaluacionComponent } from './jefe-evaluacion.component';

describe('JefeEvaluacionComponent', () => {
  let component: JefeEvaluacionComponent;
  let fixture: ComponentFixture<JefeEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JefeEvaluacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JefeEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
