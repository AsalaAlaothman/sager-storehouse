import { Component } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent {
  loginForm: FormGroup;
  is_visibility: boolean = false;
  input_type: string = 'password';
  errorMessages: any[] = [];
  email!: string;
  password!: string;
  password_confirmation!: string;

  logo = this.apiservice.mediaUrl+'/app-logo.png';

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private apiservice: ApiService,
    public dialog: MatDialog
  ) {
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: [''],
    });
  }
  ngOnInit() {
    if (this.authService.isAuthenticatedUser()) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    const { email, password } = this.loginForm.value;
    const credentials = { email, password };
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task', // Add your custom header and its value
    });
    this.http
      .post(this.apiservice.authUrl + '/login', credentials, { headers })
      .subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token);
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

  openForgetPasswordDialog(){
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      autoFocus:true,
      disableClose:true,
      width:'55%',
      data: {
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
      }
    });
  }
}
