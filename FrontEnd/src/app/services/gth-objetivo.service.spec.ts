import { TestBed } from '@angular/core/testing';

import { GthObjetivoService } from './gth-objetivo.service';

describe('GthObjetivoService', () => {
  let service: GthObjetivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GthObjetivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
