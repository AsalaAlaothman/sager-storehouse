import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl: string = 'http://127.0.0.1:8000/api';
  authUrl: string = this.apiUrl + '/auth';
  mediaUrl: string = 'http://127.0.0.1:8000/storage/admin-asset';
  constructor() {}
}
