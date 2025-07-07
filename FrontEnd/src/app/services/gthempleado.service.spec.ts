import { TestBed } from '@angular/core/testing';
 
import { GthEmpleadoService } from './gthempleado.service';
 
describe('GTHEmpleadoService', () => {
  let service: GthEmpleadoService;
 
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GthEmpleadoService);
  });
 
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});