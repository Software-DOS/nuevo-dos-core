import { TestBed } from '@angular/core/testing';

import { GthCapacitacionService } from './gthcapacitacion.service';

describe('GthCapacitacionService', () => {
  let service: GthCapacitacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GthCapacitacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
