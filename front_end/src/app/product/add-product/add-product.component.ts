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
import { ProductComponent } from '../product.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CategoryComponent } from 'src/app/category/category.component';
import { UploadImageComponent } from 'src/app/upload-image/upload-image.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
  dataForm!: FormGroup;
  errorMessages: any[] = [];
  categories!: any[];
  check_box: any[] = [];
  selectedImage!: File;

  constructor(
    public formbuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProductComponent>,
    public ngZone: NgZone,
    private router: Router,
    private authService: AuthService,
    private apiservice: ApiService,
    private http: HttpClient,
    private category: CategoryComponent,
    public uploadFile: UploadImageComponent
  ) {
    this.dataForm = this.formbuilder.group({
      name: [''],
      pro_categories: [],
      price: [],
      quantity: [],
      description: [],
      image: [],
    });
  }

  ngOnInit() {
    if (!this.authService.isAuthenticatedUser()) {
      this.router.navigate(['/login']);
    }
    this.category.getCategories().subscribe(
      (categories: any) => {
        this.categories = categories.data;
      },
      (error: any) => {
        // Handle error
      }
    );
  }

  addItem() {
    const { name, price, quantity, description } = this.dataForm.value;

    const data = {
      name,
      category: this.categories,
      price,
      quantity,
      description,
    };
    this.uploadFile.uploadFile(data.name);
    console.log(data);
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task',
      Authorization: this.authService.token(),
    });

    this.http
      .post(this.apiservice.apiUrl + '/products', data, { headers })
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
  addCategory(id: any) {
    if (this.check_box.includes(id)) {
      this.check_box.splice(this.check_box.indexOf(id), 1);
    } else {
      this.check_box.push(id);
    }
  }
  onFileSelected(event: any) {
    this.uploadFile.onFileSelected(event);
  }
  onClose() {
    this.dialogRef.close();
  }
}
