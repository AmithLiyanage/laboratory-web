import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewchemicalsdialogComponent } from './newchemicalsdialog.component';

describe('NewchemicalsdialogComponent', () => {
  let component: NewchemicalsdialogComponent;
  let fixture: ComponentFixture<NewchemicalsdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewchemicalsdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewchemicalsdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
