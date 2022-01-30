import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByTagComponent } from './search-by-tag.component';

describe('SearchByTagComponent', () => {
  let component: SearchByTagComponent;
  let fixture: ComponentFixture<SearchByTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchByTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
