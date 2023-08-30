import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustodianComponent } from './custodian.component';

describe('CustodianComponent', () => {
  let component: CustodianComponent;
  let fixture: ComponentFixture<CustodianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustodianComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustodianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
