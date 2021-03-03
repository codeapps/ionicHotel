import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KotPrintComponent } from './kot-print.component';

describe('KotPrintComponent', () => {
  let component: KotPrintComponent;
  let fixture: ComponentFixture<KotPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KotPrintComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KotPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
