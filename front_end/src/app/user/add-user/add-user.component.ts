import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserComponent } from '../user.component';
import { AuthService } from 'src/app/services/auth.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent {
  userForm: FormGroup;
  errorMessages: any[] = [];
  is_visibility = this.authService.is_visibility;
  input_type = this.authService.input_type;
  constructor(
    public formbuilder: FormBuilder,
    public dialogRef: MatDialogRef<UserComponent>,
    public ngZone: NgZone,
    private router: Router,
    private authService: AuthService,
    private apiservice: ApiService,
    private http: HttpClient,
    private user:UserComponent
  ) {
    this.userForm = this.formbuilder.group({
      email: [''],
      name: [''],
      password: [''],
      password_confirmation: [''],
    });
  }

  ngOnInit() {
    if (!this.authService.isAuthenticatedUser()) {
      this.router.navigate(['/login']);
    }
  }

  addUser() {
    const { email, name, password, password_confirmation } =
      this.userForm.value;
    const data = { email, name, password, password_confirmation };

    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task',
      Authorization: this.authService.token(),
    });
    this.http
      .post(this.apiservice.apiUrl + '/users', data, { headers })
      .subscribe(
        (response: any) => {
          window.location.reload();
        },
        (error: HttpErrorResponse) => {
          console.log(Object.values(error.error))
          if (error.status == 422) {

            this.errorMessages = Object.values(error.error.errors).flat();
          } else {
            this.errorMessages = Object.values(error.error[1]).flat();
          }
        }
      );
  }

  onClose() {
    this.dialogRef.close();
  }

  password_visibility() {
    this.input_type = this.authService.password_visibility();

  }
}
