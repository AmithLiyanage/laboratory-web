import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LendingquantitydialogComponent } from './lendingquantitydialog.component';

describe('LendingquantitydialogComponent', () => {
  let component: LendingquantitydialogComponent;
  let fixture: ComponentFixture<LendingquantitydialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LendingquantitydialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LendingquantitydialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
