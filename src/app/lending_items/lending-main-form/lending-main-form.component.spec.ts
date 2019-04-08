import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LendingMainFormComponent } from './lending-main-form.component';

describe('LendingMainFormComponent', () => {
  let component: LendingMainFormComponent;
  let fixture: ComponentFixture<LendingMainFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LendingMainFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LendingMainFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
