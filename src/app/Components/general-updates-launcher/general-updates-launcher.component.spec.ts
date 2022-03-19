import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralUpdatesLauncherComponent } from './general-updates-launcher.component';

describe('GeneralUpdatesLauncherComponent', () => {
  let component: GeneralUpdatesLauncherComponent;
  let fixture: ComponentFixture<GeneralUpdatesLauncherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralUpdatesLauncherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralUpdatesLauncherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
