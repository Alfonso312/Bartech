import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, NgIf],
    template: `
    <div class="view-container">
      <div class="glass-card register-card">
        <div class="card-header">
          <h2>Create Account</h2>
          <p>Join Bartech today.</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              id="username" 
              type="text" 
              formControlName="username" 
              class="glass-input" 
              placeholder="johndoe"
            />
            <div *ngIf="registerForm.get('username')?.touched && registerForm.get('username')?.invalid" class="error-text">
              Username is required
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email" 
              class="glass-input" 
              placeholder="you@example.com"
            />
            <div *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.invalid" class="error-text">
              Valid email is required
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password" 
              class="glass-input"
              autocomplete="new-password"
              placeholder="••••••••"
            />
            <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.invalid" class="error-text">
              Password must be at least 6 characters
            </div>
          </div>

          <div *ngIf="errorMessage" class="error-text server-error">
            {{ errorMessage }}
          </div>

          <div *ngIf="successMessage" class="success-text">
            {{ successMessage }}
          </div>

          <button type="submit" class="glass-button" [disabled]="registerForm.invalid || isLoading">
            {{ isLoading ? 'Creating...' : 'Register' }}
          </button>
        </form>

        <div class="card-footer">
          <p>Already have an account? <a routerLink="/login">Sign In</a></p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .register-card {
      width: 100%;
      max-width: 400px;
      padding: 2.5rem;
      animation: slideUp 0.5s ease-out;
    }
    
    .card-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .card-header h2 {
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(to right, var(--text-main), var(--text-muted));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }
    
    .card-footer {
      margin-top: 2rem;
      text-align: center;
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    
    .server-error {
      text-align: center;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: rgba(239, 68, 68, 0.1);
      border-radius: 0.25rem;
    }

    .success-text {
      text-align: center;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
      border-radius: 0.25rem;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    registerForm: FormGroup = this.fb.group({
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    isLoading = false;
    errorMessage = '';
    successMessage = '';

    onSubmit() {
        if (this.registerForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';

            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.successMessage = 'Registration successful! Redirecting...';
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 1500);
                },
                error: (err) => {
                    this.isLoading = false;
                    this.errorMessage = err.error?.message || 'Registration failed. User may already exist.';
                }
            });
        }
    }
}
