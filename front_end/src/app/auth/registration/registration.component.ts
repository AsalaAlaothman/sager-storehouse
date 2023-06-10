import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  registerForm: FormGroup;
  is_visibility: boolean = false;
  input_type: string = 'password';
  errorMessages: any[] = [];
  logo = this.apiservice.mediaUrl + '/app-logo.png';

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private apiservice: ApiService,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      email: [''],
      name: [''],
      password: [''],
      password_confirmation:['']
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticatedUser()) {
      this.router.navigate(['/home']);
    }
  }

  register() {
    const { email, name, password, password_confirmation } =
      this.registerForm.value;
    const data = { email, name, password, password_confirmation };
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task', // Add your custom header and its value
    });
    this.http
      .post(this.apiservice.authUrl + '/register', data, { headers })
      .subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user',response.user);
          this.router.navigate(['/home']);
          window.location.reload();

        },
        (error: HttpErrorResponse) => {
          if (error.status == 422) {
            this.errorMessages = Object.values(error.error.errors).flat();
          } else {
            this.errorMessages = Object.values(error.error[1]).flat();
          }
        }
      );
  }

  password_visibility() {
    this.is_visibility = !this.is_visibility;
    if (this.is_visibility == true) {
      this.input_type = 'text';
    } else {
      this.input_type = 'password';
    }
  }
}
