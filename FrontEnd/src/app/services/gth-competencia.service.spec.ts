import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GthCompetenciaService } from './gth-competencia.service';

describe('GthCompetenciaService', () => {
  let service: GthCompetenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(GthCompetenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
