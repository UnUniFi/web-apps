import { AuthService } from '../auth.service';
import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.css'],
})
export class SignOutComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.signOut().then(() => {
      timer(6000).subscribe(() => {
        window.location.reload();
      });
    });
  }
}
