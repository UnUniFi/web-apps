import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationsComponent } from './verifications.component';

describe('VerificationsComponent', () => {
  let component: VerificationsComponent;
  let fixture: ComponentFixture<VerificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
