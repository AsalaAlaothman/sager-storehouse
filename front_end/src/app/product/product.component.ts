import { Component } from '@angular/core';
import { EditProductComponent } from './edit-product/edit-product.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { AddProductComponent } from './add-product/add-product.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { CategoryComponent } from '../category/category.component';
import { ConfirmationDialogComponent } from '../layouts/confirmation-dialog-component/confirmation-dialog-component.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  data: any;
  page_number: any;
  displayedColumns: string[] = [
    'id',
    'name',
    'categories_count',
    'created_by',
    'price',
    'quantity',
    'action',
  ];
  id!: number;
  name!: string;
  dataSource!: MatTableDataSource<any>;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private apiservice: ApiService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticatedUser()) {
      this.router.navigate(['/login']);
    }

    this.getproducts();
  }

  getproducts(page: number = 1) {
    this.page_number = page;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task',
      Authorization: this.authService.token(),
    });
    this.http
      .get(this.apiservice.apiUrl + `/products?page=${page}`, { headers })
      .subscribe((response: any) => {
        this.dataSource = new MatTableDataSource<any>(response.data);
      });
  }
  openAddItemDialog() {
    const dialogRef = this.dialog.open(AddProductComponent, {
      autoFocus: true,
      disableClose: true,
      width: '55%',
      data: {},
    });
  }

  onDelete(id: any) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task',
      Authorization: this.authService.token(),
    });
    this.http
      .delete(this.apiservice.apiUrl + '/products/' + id + '/delete', {
        headers,
      })
      .subscribe((response: any) => {
        this.getproducts();
      });
  }
  openConfirmationDialog(id:any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.onDelete(id)
      }
    });
  }

  onUpdate(id: any) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task',
      Authorization: this.authService.token(),
    });
    this.http
      .get(this.apiservice.apiUrl + '/products/' + id, { headers })
      .subscribe(
        (response: any) => {
          const dialogRef = this.dialog.open(EditProductComponent, {
            autoFocus: true,
            disableClose: true,
            width: '55%',
            data: {
              id: response.data.id,
              name: response.data.name,
              categories: response.data.category,
              description: response.data.description,
              image: response.data.image,
              quantity: response.data.quantity,
              price: response.data.price,
            },
          });
        },
        (error: any) => {
          // Handle error scenarios here
        }
      );
  }

  onMinus(id: any, quantity: any) {
    if(quantity == 1){
      this.onDelete(id);
    }
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task',
      Authorization: this.authService.token(),
    });
    this.http
      .get(this.apiservice.apiUrl + '/products/minus/' + id, { headers })
      .subscribe(
        (response: any) => {
          this.getproducts();
        },
        (error: any) => {
          // Handle error scenarios here
        }
      );
  }
}
