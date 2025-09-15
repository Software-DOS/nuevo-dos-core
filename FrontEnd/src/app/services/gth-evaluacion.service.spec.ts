import { TestBed } from '@angular/core/testing';

import { GthEvaluacionService } from './gth-evaluacion.service';

describe('GthEvaluacionService', () => {
  let service: GthEvaluacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GthEvaluacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
