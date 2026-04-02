import { Component, computed, inject, signal } from '@angular/core';
import { AuthData } from '../interfaces/authData.interface';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-page',
  imports: [FormField, CommonModule],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css',
})
export class AuthPage {
  authService = inject(AuthService);
  authMode = signal<'login' | 'signin'>('login');
  btnMessage = computed(() => (this.authMode() === 'login' ? 'login' : 'sign in'));

  formModel = signal<AuthData>({
    email: '',
    password: '',
  });

  form = form(this.formModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
  });

  setAuthMode(mode: 'login' | 'signin') {
    this.authMode.set(mode);
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    await submit(this.form, async () => {
      const { email, password } = this.formModel();

      if (this.authMode() === 'login') {
        await this.authService.login(email, password);
      } else {
        await this.authService.register(email, password);
      }
    });
  }
}
