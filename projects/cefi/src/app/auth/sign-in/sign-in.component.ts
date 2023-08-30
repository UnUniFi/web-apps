import { Component } from '@angular/core';
import { AuthProvider, GithubAuthProvider, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  email = '';
  password = '';
  processing = false;

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {}

  async signIn(provider: AuthProvider | { email: string; password: string }) {
    this.processing = true;

    try {
      await this.auth.signIn(provider);
      this.router.navigate(['']);
    } catch (e) {
      window.alert('Failed to sign in');
    } finally {
      this.processing = false;
    }
  }

  async signInGoogle() {
    await this.signIn(new GoogleAuthProvider());
  }

  async signInGithub() {
    await this.signIn(new GithubAuthProvider());
  }

  async signInEmail(email: string, password: string) {
    this.signIn({ email, password });
  }
}
