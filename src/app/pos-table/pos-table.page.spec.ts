import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTablePage } from './pos-table.page';

describe('PosTablePage', () => {
  let component: PosTablePage;
  let fixture: ComponentFixture<PosTablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosTablePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
