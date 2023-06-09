import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from './add-user/add-user.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { EditUserComponent } from '../User/edit-user/edit-user.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  displayedColumns: string[] = ['id', 'name', 'email', 'action'];
  id!: number;
  name!: string;
  email!: string;
  dataSource!: MatTableDataSource<any>;
  user!:any;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private apiservice: ApiService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task',
      Authorization: this.authService.token(),
    });
    this.http
      .get(this.apiservice.apiUrl + '/users', { headers })
      .subscribe((response: any) => {

        this.dataSource = new MatTableDataSource<any>(response.data);
      });
  }
  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      autoFocus: true,
      disableClose: true,
      width: '55%',
      data: {
        number: this.id,
        name: this.name,
        email: this.email,
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
      .delete(this.apiservice.apiUrl + '/users/' + id + '/delete', { headers })
      .subscribe((response: any) => {
        this.getUsers();
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
      .get(this.apiservice.apiUrl + '/users/' + id, { headers })
      .subscribe(
        (response: any) => {

          const dialogRef = this.dialog.open(EditUserComponent, {
            autoFocus: true,
            disableClose: true,
            width: '55%',
            data: {
              id:response.data.id,
              name :response.data.name,
              email:response.data.email,
            },
          });
        },
        (error) => {
          console.error('Error fetching user:', error);
          // Handle error scenarios here
        }
      );

    //////////////////////////////////

  }
}
