import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemhistoryComponent } from './remhistory.component';

describe('RemhistoryComponent', () => {
  let component: RemhistoryComponent;
  let fixture: ComponentFixture<RemhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
