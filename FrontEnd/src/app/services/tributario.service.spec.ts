import { TestBed } from '@angular/core/testing';

import { TributarioService } from './tributario.service';

describe('TributarioService', () => {
  let service: TributarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TributarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
