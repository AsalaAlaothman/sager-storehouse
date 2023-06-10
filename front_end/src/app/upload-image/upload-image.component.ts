import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-upload-image',
  template: '',
  styleUrls: ['./upload-image.component.css'],
})
export class UploadImageComponent {
  selectedFile!: File | null;

  constructor(private http: HttpClient,private authService:AuthService, private apiService :ApiService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile)
  }

  uploadFile(name:any) {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      formData.append('name', name);

      // console.log();
      const headers = new HttpHeaders({
        api_key: 'asala-task',
        Authorization: this.authService.token(),
      });
      this.http.post(this.apiService.apiUrl+'/upload', formData,{headers}).subscribe(
        (response) => {
        },
        (error) => {
        }
      );
    }
  }
}
