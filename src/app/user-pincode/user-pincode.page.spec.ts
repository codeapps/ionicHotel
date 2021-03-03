import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPincodePage } from './user-pincode.page';

describe('UserPincodePage', () => {
  let component: UserPincodePage;
  let fixture: ComponentFixture<UserPincodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPincodePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPincodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
