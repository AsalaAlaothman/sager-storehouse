import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Inject, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  check_email :string ='d-none';
  errorMessages :any[]=[];
  constructor(
    private formbuilder: FormBuilder,
    private dialogRef: MatDialogRef<LoginComponent>,
    private router: Router,
    private ngZone:NgZone,
    private apiservice:ApiService,
    private http:HttpClient,  ) {
    this.resetForm = this.formbuilder.group({
      email: ['', [Validators.required]],
    });
  }

  resetPassword() {
    this.check_email = 'form-group col-sm-8 mt-2 alert alert-danger';
    this.errorMessages =[];
    const { email} = this.resetForm.value
    const credentials = { email};
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task', // Add your custom header and its value
    });
    this.http
      .post(this.apiservice.authUrl + '/reset-password', credentials, { headers }).subscribe(
        (response: any) => {
          this.onClose();
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

  onClose() {
    this.dialogRef.close();
  }
}
