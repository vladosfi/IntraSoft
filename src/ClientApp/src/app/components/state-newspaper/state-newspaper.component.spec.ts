import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateNewspaperComponent } from './state-newspaper.component';

describe('StateNewspaperComponent', () => {
  let component: StateNewspaperComponent;
  let fixture: ComponentFixture<StateNewspaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateNewspaperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateNewspaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
