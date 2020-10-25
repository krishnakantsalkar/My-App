import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidTrackerDistrictsComponent } from './covid-tracker-districts.component';

describe('CovidTrackerDistrictsComponent', () => {
  let component: CovidTrackerDistrictsComponent;
  let fixture: ComponentFixture<CovidTrackerDistrictsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CovidTrackerDistrictsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidTrackerDistrictsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
