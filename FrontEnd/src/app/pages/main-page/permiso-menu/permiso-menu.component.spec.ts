import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisoMenuComponent } from './permiso-menu.component';

describe('PermisoMenuComponent', () => {
  let component: PermisoMenuComponent;
  let fixture: ComponentFixture<PermisoMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermisoMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisoMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
