import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AddCategoryComponent } from './add-category/add-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent {
  data: any;
  page_number: any;
  displayedColumns: string[] = ['id', 'name', 'action'];
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
    this.getcategories(1);
  }

  getcategories(page: number = 1): any {
    this.page_number = page;

    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task',
      Authorization: this.authService.token(),
    });
    this.http
      .get(this.apiservice.apiUrl + `/categories?page=${page}`, { headers })
      .subscribe((response: any) => {
        this.dataSource = new MatTableDataSource<any>(response.data);

      });
  }
  openAddItemDialog() {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      autoFocus: true,
      disableClose: true,
      width: '55%',
      data: {
        number: this.id,
        name: this.name,
      },
    });
  }

  onDelete(id: any, index: any) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task',
      Authorization: this.authService.token(),
    });
    this.http
      .delete(this.apiservice.apiUrl + '/categories/' + id + '/delete', {
        headers,
      })
      .subscribe((response: any) => {
        this.getcategories();
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
      .get(this.apiservice.apiUrl + '/categories/' + id, { headers })
      .subscribe(
        (response: any) => {
          const dialogRef = this.dialog.open(EditCategoryComponent, {
            autoFocus: true,
            disableClose: true,
            width: '55%',
            data: {
              id: response.data.id,
              name: response.data.name,
            },
          });
        },
        (error) => {
          console.error('Error fetching user:', error);
          // Handle error scenarios here
        }
      );
  }

  getCategories(): Observable<string[]> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task',
      Authorization: this.authService.token(),
    });

    return this.http.get<any[]>(this.apiservice.apiUrl + '/categories', {
      headers,
    });
  }
}
