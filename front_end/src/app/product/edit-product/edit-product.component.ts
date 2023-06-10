import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Component, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProductComponent } from '../product.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UploadImageComponent } from 'src/app/upload-image/upload-image.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent {
  dataForm: FormGroup;
  errorMessages: any[] = [];
  is_visibility = this.authService.is_visibility;
  input_type = this.authService.input_type;
  mediaUrl = this.apiservice.prodauctUrl;
  constructor(
    public formbuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProductComponent>,
    public ngZone: NgZone,
    private router: Router,
    private authService: AuthService,
    private apiservice: ApiService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private uploadFile: UploadImageComponent
  ) {
    this.dataForm = this.formbuilder.group({
      name: [''],
      pro_categories: [],
      price: [],
      quantity: [],
      descreption: [],
      image: [],
    });
  }

  ngOnInit() {
    if (!this.authService.isAuthenticatedUser()) {
      this.router.navigate(['/login']);
    }
  }

  editItem() {
    const { name } = this.dataForm.value;
    const data = { name };

    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task',
      Authorization: this.authService.token(),
    });
    this.http
      .post(
        this.apiservice.apiUrl + '/products/' + this.data.id + '/update',
        data,
        { headers }
      )
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

  onFileSelected(event: any) {
    this.uploadFile.onFileSelected(event);
  }

  onClose() {
    this.dialogRef.close();
  }
}
