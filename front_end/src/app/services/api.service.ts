import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl: string = 'http://127.0.0.1:8001/api';
  authUrl: string = this.apiUrl + '/auth';
  mediaUrl: string = 'http://127.0.0.1:8001/storage/admin-asset';
  prodauctUrl: string = 'http://127.0.0.1:8001/storage';

  constructor() {}
}
