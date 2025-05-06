import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelProductoComponent } from './model-producto.component';

describe('ModelProductoComponent', () => {
  let component: ModelProductoComponent;
  let fixture: ComponentFixture<ModelProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelProductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
