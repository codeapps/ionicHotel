import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KotListComponent } from './kot-list.component';

describe('KotListComponent', () => {
  let component: KotListComponent;
  let fixture: ComponentFixture<KotListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KotListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
