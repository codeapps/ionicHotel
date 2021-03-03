import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosKeybordComponent } from './pos-keybord.component';

describe('PosKeybordComponent', () => {
  let component: PosKeybordComponent;
  let fixture: ComponentFixture<PosKeybordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosKeybordComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosKeybordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
