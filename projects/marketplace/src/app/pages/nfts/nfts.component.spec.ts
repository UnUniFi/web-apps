import { NftsComponent } from './nfts.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('NftsComponent', () => {
  let component: NftsComponent;
  let fixture: ComponentFixture<NftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NftsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
