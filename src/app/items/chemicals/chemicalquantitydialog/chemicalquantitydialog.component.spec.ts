import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalquantitydialogComponent } from './chemicalquantitydialog.component';

describe('ChemicalquantitydialogComponent', () => {
  let component: ChemicalquantitydialogComponent;
  let fixture: ComponentFixture<ChemicalquantitydialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChemicalquantitydialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalquantitydialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
