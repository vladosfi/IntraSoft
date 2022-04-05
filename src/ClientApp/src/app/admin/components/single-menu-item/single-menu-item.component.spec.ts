import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMenuItemComponent } from './single-menu-item.component';

describe('SingleMenuItemComponent', () => {
  let component: SingleMenuItemComponent;
  let fixture: ComponentFixture<SingleMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleMenuItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
