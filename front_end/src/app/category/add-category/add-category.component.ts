import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryComponent } from '../category.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
})
export class AddCategoryComponent {
  dataForm: FormGroup;
  errorMessages: any[] = [];
  is_visibility = this.authService.is_visibility;
  input_type = this.authService.input_type;
  constructor(
    public formbuilder: FormBuilder,
    public dialogRef: MatDialogRef<CategoryComponent>,
    public ngZone: NgZone,
    private router: Router,
    private authService: AuthService,
    private apiservice: ApiService,
    private http: HttpClient
  ) {
    this.dataForm = this.formbuilder.group({
      name: [''],
    });
  }

  ngOnInit() {
    if (!this.authService.isAuthenticatedUser()) {
      this.router.navigate(['/login']);
    }
  }

  addItem() {

    const { name } = this.dataForm.value;
    const data = { name };

    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task',
      Authorization: this.authService.token(),
    });
    this.http
      .post(this.apiservice.apiUrl + '/categories', data, { headers })
      .subscribe(
        (response: any) => {
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
}
