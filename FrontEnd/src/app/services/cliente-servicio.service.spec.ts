import { TestBed } from '@angular/core/testing';

import { ClienteServicioService } from './cliente-servicio.service';

describe('ClienteServicioService', () => {
  let service: ClienteServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
