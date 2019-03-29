import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicallistComponent } from './chemicallist.component';

describe('ChemicallistComponent', () => {
  let component: ChemicallistComponent;
  let fixture: ComponentFixture<ChemicallistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChemicallistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicallistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
