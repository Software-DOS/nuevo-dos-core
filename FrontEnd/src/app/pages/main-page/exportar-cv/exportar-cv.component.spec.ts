import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportarCvComponent } from './exportar-cv.component';

describe('ExportarCvComponent', () => {
  let component: ExportarCvComponent;
  let fixture: ComponentFixture<ExportarCvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportarCvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportarCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
