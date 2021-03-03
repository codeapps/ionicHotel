import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosThermalDevicePage } from './pos-thermal-device.page';

describe('PosThermalDevicePage', () => {
  let component: PosThermalDevicePage;
  let fixture: ComponentFixture<PosThermalDevicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosThermalDevicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosThermalDevicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
