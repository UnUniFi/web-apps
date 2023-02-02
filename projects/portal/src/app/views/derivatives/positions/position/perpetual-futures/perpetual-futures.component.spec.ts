import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerpetualFuturesComponent } from './perpetual-futures.component';

describe('PerpetualFuturesComponent', () => {
  let component: PerpetualFuturesComponent;
  let fixture: ComponentFixture<PerpetualFuturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerpetualFuturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerpetualFuturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
