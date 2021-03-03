import { TestBed } from '@angular/core/testing';

import { RoomRegisterService } from './room-register.service';

describe('RoomRegisterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoomRegisterService = TestBed.get(RoomRegisterService);
    expect(service).toBeTruthy();
  });
});
