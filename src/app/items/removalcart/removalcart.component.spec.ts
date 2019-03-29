import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovalcartComponent } from './removalcart.component';

describe('RemovalcartComponent', () => {
  let component: RemovalcartComponent;
  let fixture: ComponentFixture<RemovalcartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemovalcartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovalcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
