import { TestBed } from '@angular/core/testing';

import { LlenarcomboService } from './llenarcombo.service';

describe('LlenarcomboService', () => {
  let service: LlenarcomboService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LlenarcomboService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
