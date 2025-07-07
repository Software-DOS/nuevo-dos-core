import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCvComponent } from './admin-cv.component';

describe('AdminCvComponent', () => {
  let component: AdminCvComponent;
  let fixture: ComponentFixture<AdminCvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
