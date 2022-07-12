import { LibViewNftsComponent } from './nfts.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('LibViewNftsComponent', () => {
  let component: LibViewNftsComponent;
  let fixture: ComponentFixture<LibViewNftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LibViewNftsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibViewNftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
