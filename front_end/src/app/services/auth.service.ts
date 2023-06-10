import { EventEmitter, Injectable, Output } from '@angular/core';
import { ApiService } from './api.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  @Output() itemDeleted: EventEmitter<void> = new EventEmitter<void>();
  errorMessages: any[] = [];
  headers: any;
  is_visibility: boolean = false;
  input_type: string = 'password';



  constructor(private apiservice: ApiService, private http: HttpClient) {}

  // Check if the user is authenticated
  isAuthenticatedUser(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    }
    return false;
  }



  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.itemDeleted.emit();
    window.location.reload();
  }

  token(){
    return "Bearer "+localStorage.getItem('token');
  }

  password_visibility() {
    this.is_visibility = !this.is_visibility;
    if (this.is_visibility == true) {
      return 'text';
    } else {
      return 'password';
    }
  }
}
