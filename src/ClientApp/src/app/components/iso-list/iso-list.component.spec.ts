import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsoListComponent } from './iso-list.component';

describe('IsoListComponent', () => {
  let component: IsoListComponent;
  let fixture: ComponentFixture<IsoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
