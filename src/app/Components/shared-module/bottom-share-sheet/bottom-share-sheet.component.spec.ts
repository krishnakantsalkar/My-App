import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomShareSheetComponent } from './bottom-share-sheet.component';

describe('BottomShareSheetComponent', () => {
  let component: BottomShareSheetComponent;
  let fixture: ComponentFixture<BottomShareSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomShareSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomShareSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
