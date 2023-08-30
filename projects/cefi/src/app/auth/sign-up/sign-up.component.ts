import { AuthService } from '../auth.service';
import { Component } from '@angular/core';
import { AuthProvider, GithubAuthProvider, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  email = '';
  password = '';
  idEntered = false;
  processing = false;

  constructor(private router: Router, private auth: AuthService) {}

  async signUp(provider: AuthProvider | { email: string; password: string }) {
    this.processing = true;

    try {
      await this.auth.signUp(provider);
      window.alert('Succeeded to sign up');
      this.router.navigate(['']);
    } catch (e) {
      window.alert('Failed to sign up');
    } finally {
      this.processing = false;
    }
  }

  async signUpGoogle() {
    await this.signUp(new GoogleAuthProvider());
  }

  async signUpGithub() {
    await this.signUp(new GithubAuthProvider());
  }

  signUpEmail(email: string, password: string) {
    this.signUp({ email, password });
  }
}
