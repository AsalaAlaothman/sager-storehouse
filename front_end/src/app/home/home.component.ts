import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isAuthenticated: boolean;
  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.isAuthenticated = authService.isAuthenticatedUser();
  }
  ngOnInit() {
    if (this.authService.isAuthenticatedUser()) {
      this.router.navigate(['/home']);
    }
  }
}
