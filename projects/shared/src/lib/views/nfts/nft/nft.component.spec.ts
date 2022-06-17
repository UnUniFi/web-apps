import { LibViewNftComponent } from './nft.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

describe('LibViewNftComponent', () => {
  let component: LibViewNftComponent;
  let fixture: ComponentFixture<LibViewNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LibViewNftComponent],
      imports: [RouterTestingModule, MatSnackBarModule, MatDialogModule],
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
