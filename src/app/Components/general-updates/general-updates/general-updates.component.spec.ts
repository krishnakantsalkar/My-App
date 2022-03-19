import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralUpdatesComponent } from './general-updates.component';

describe('GeneralUpdatesComponent', () => {
  let component: GeneralUpdatesComponent;
  let fixture: ComponentFixture<GeneralUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralUpdatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
