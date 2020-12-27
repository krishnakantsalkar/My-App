import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BdayComponent } from './bday.component';

describe('BdayComponent', () => {
  let component: BdayComponent;
  let fixture: ComponentFixture<BdayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BdayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
