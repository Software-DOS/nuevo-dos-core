import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoCvComponent } from './empleado-cv.component';

describe('EmpleadoCvComponent', () => {
  let component: EmpleadoCvComponent;
  let fixture: ComponentFixture<EmpleadoCvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpleadoCvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadoCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
