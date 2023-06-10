import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Component, Inject, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserComponent } from 'src/app/user/user.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent {
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
    public user: UserComponent,
    @Inject(MAT_DIALOG_DATA) public data: any
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



  editUser() {

    const { id, email, name, password, password_confirmation } =
      this.userForm.value;
    const data = { id, email, name, password, password_confirmation };

    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task',
      Authorization: this.authService.token(),
    });
    this.http
      .post(this.apiservice.apiUrl + '/users/'+this.data.id +'/update', data, { headers })
      .subscribe(
        (response: any) => {
          this.onClose();
          window.location.reload();
        },
        (error: HttpErrorResponse) => {
          console.log(Object.values(error.error));
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
