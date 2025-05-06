import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapRowComponent } from './cap-row.component';

describe('CapRowComponent', () => {
  let component: CapRowComponent;
  let fixture: ComponentFixture<CapRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
