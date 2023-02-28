import { NftTxApplicationService } from '../../../models/ununifi/tx/nft/nft-tx.application.service';
import { LibViewNftComponent } from './nft.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

jest.mock('../../../models/ununifi/tx/nft/nft-tx.application.service');

describe('LibViewNftComponent', () => {
  let component: LibViewNftComponent;
  let fixture: ComponentFixture<LibViewNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LibViewNftComponent],
      imports: [RouterTestingModule, MatSnackBarModule, MatCardModule],
      providers: [NftTxApplicationService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibViewNftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
