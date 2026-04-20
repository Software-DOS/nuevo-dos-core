import { TestBed } from '@angular/core/testing';

import { GthAreaService } from './gth-area.service';

describe('GthAreaService', () => {
  let service: GthAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GthAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
