import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantitydialogComponent } from './quantitydialog.component';

describe('QuantitydialogComponent', () => {
  let component: QuantitydialogComponent;
  let fixture: ComponentFixture<QuantitydialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantitydialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantitydialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
