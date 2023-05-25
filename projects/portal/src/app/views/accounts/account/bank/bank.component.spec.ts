import { BankComponent } from './bank.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('first', () => {
  let component: BankComponent;
  let fixture: ComponentFixture<BankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BankComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('have title', () => {
    const element = fixture.nativeElement;
    expect(element.querySelector('h2').textContent).toEqual('Transactions History');
  });
});
