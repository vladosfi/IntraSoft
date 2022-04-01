import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularMaterialMenuComponent } from './angular-material-menu.component';

describe('AngularMaterialMenuComponent', () => {
  let component: AngularMaterialMenuComponent;
  let fixture: ComponentFixture<AngularMaterialMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularMaterialMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularMaterialMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
