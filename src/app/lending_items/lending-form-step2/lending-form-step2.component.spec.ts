import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LendingFormStep1Component } from './lending-form-step2.component';

describe('LendingFormStep1Component', () => {
  let component: LendingFormStep1Component;
  let fixture: ComponentFixture<LendingFormStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LendingFormStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LendingFormStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
