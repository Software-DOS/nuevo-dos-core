import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelClienteComponent } from './model-cliente.component';

describe('ModelClienteComponent', () => {
  let component: ModelClienteComponent;
  let fixture: ComponentFixture<ModelClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
